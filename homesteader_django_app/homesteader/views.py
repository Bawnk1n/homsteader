from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout, login
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import get_token
from django.http import JsonResponse
import json
from homesteader.models import Garden, Plant, Container
from django.db import transaction
from django.utils import timezone


def index(request):
    return render(request, 'index.html')


@csrf_exempt
def get_csrf_token(request):
    print('here2')
    token = get_token(request)
    return JsonResponse({"csrfToken": token})


def register(request):
    print('ghere?')
    if request.method == "POST":
        # Parse the JSON body of the request
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username')
        password = data.get("password")
        email = data.get('email')
        password_match = data.get('password_match')
        # make sure all fields are not blank
        if not username or not password or not email:
            return JsonResponse({"Message": "All fields required"}, status=status.HTTP_400_BAD_REQUEST)
        # make sure passwords match
        elif password != password_match:
            return JsonResponse({"Message": "Error creating account, please try again"}, status=status.HTTP_406_NOT_ACCEPTABLE)
        # make sure username isnt taken
        elif User.objects.filter(username=username).exists():
            return JsonResponse({"Message": "Username is taken"}, status=status.HTTP_400_BAD_REQUEST)
        # make sure email isnt used already
        elif User.objects.filter(email=email).exists():
            return JsonResponse({"Message": "Email address already in use"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.create_user(
                username=username, password=password, email=email)
            user = authenticate(username=username, password=password)
            # Log the user in
            if user is not None:
                login(request, user)
            return JsonResponse({"status": "success", "Message": "Created Succesfully"}, status=status.HTTP_201_CREATED)
        except ValidationError:
            return JsonResponse({"status": "error", "Message": str(ValidationError)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return JsonResponse({"status": "error", "Message": "Something went wrong when creating new user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def login_api(request):
    if request.method == 'POST':
        # Parse the JSON body of the request
        data = json.loads(request.body.decode('utf-8'))

        # Retrieve username and password
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            request.session['user_id'] = request.user.id
            return JsonResponse({"Message": "Login Succesful", "success": True}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({"Message": "Invalid Credentials", "success": False}, status=status.HTTP_401_UNAUTHORIZED)


# @ensure_csrf_cookie
@csrf_exempt
def logout_api(request):
    if request.method == 'POST':
        request.session.flush()
        logout(request)
        return JsonResponse({"Message": "Logout Successful", "success": True}, status=status.HTTP_200_OK)


@api_view(['GET'])
def is_authenticated(request):
    if request.user.is_authenticated:
        return JsonResponse({"Message": "User is authenticated", "success": True, "username": request.user.username})
    else:
        return JsonResponse({"Message": "User is not authenticated", "success": False})


# @login_required
def save_garden(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                garden_object = json.loads(
                    request.body.decode('utf-8'))
                is_user_garden = Garden.objects.filter(
                    user=request.user).exists()
                if is_user_garden:
                    return JsonResponse({'status': 'error', 'message': 'User already has a garden'}, status=400)
                garden = Garden.objects.create(
                    user=request.user, name=garden_object['name'])
                # Do something with the garden_object
                containers = garden_object.get('containers', [])
                if not containers:
                    return JsonResponse({'status': 'error', 'message': 'No containers provided'}, status=400)
                for container in containers:
                    saved_container = Container.objects.create(
                        user=request.user,
                        name=container.get('name', ''),
                        size=container.get('size', ''),
                        garden=garden,
                        instructions=container.get('instructions', ''),
                        useful_advice=container.get('usefulAdvice', ''),
                        shopping_list=container.get('shoppingList', '')
                    )
                    for plant in container.get('plants', []):
                        saved_plant = Plant.objects.create(
                            user=request.user,
                            container=saved_container,
                            name=plant.get('name', ''),
                            planting_instructions=plant.get(
                                'plantingInstructions', ''),
                            when_to_plant=plant.get('whenToPlant', ''),
                            first_yield=plant.get('firstYield', ''),
                            first_yield_countdown_start=plant.get(
                                'firstYieldCountdownStart', 0),
                            number_of_plants=plant.get('numberOfPlants', 0),
                            general_tips_and_tricks=plant.get(
                                'generalTipsAndTricks', ''),
                            little_known_fact=plant.get('littleKnownFact', ''),
                            advanced_gardening_tip=plant.get(
                                'advancedGardeningTip', '')
                        )
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'bad request'}, status=400)


# @login_required
def retrieve_garden(request):
    print('test')
    if request.user.is_authenticated:

        try:
            user_garden = Garden.objects.get(user=request.user)
        except Garden.DoesNotExist:
            return JsonResponse({"status": 'fail', 'message': 'user has no garden'})
        recreated_garden = {}
        recreated_garden['name'] = user_garden.name
        recreated_garden['containers'] = []
        containers = Container.objects.filter(
            user=request.user, garden=user_garden.id)
        if containers.exists():
            for container in containers:
                container_dict = {'name': container.name,
                                  'size': container.size,
                                  'id': container.id,
                                  'instructions': container.instructions,
                                  'usefulAdvice': container.useful_advice,
                                  'shoppingList': container.shopping_list,
                                  'plants': []
                                  }
                plants = Plant.objects.filter(
                    user=request.user, container=container)
                if plants.exists():
                    for plant in plants:
                        plant_dict = {'name': plant.name,
                                      'id': plant.id,
                                      'plantingInstructions': plant.planting_instructions,
                                      'whenToPlant': plant.when_to_plant,
                                      'firstYield': plant.first_yield,
                                      'firstYieldCountdownStart': plant.first_yield_countdown_start,
                                      'numberOfPlants': plant.number_of_plants,
                                      'generalTipsAndTricks': plant.general_tips_and_tricks,
                                      'littleKnownFact': plant.little_known_fact,
                                      'advancedGardeningTip': plant.advanced_gardening_tip,
                                      'startDate': plant.start_date
                                      }
                        container_dict['plants'].append(plant_dict)
                recreated_garden['containers'].append(container_dict)

        print('user_garden: ', user_garden)

        return JsonResponse({'status': 'success', 'garden': recreated_garden, 'message': 'Garden successfully retrieved'})
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated'})


@login_required
def set_plant_start_date(request):
    if request.method == "POST":
        try:
            object = json.loads(request.body.decode('utf-8'))
            user_plant_name = object['plant']['name']
            container_id = object['containerId']
            start_date = object.get('startDate', timezone.now().date())
            user = request.user
            plant = Plant.objects.get(
                name=user_plant_name, user=user, container=container_id)
            plant.start_date = start_date
            plant.save()

            print(plant.name)
            return JsonResponse({'status': 'success', 'message': 'fuck you'}, status=200)
        except Plant.DoesNotExist:
            return JsonResponse({'status': 'failure', 'message': 'Plant does not exist'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'failure', 'message': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'failure', 'message': str(e)}, status=500)


@login_required
def delete_garden(request):
    if request.method == "DELETE":
        try:
            user = request.user
            user_garden = Garden.objects.get(user=user)
            user_garden.delete()
            return JsonResponse({'status': 'success', 'message': 'Garden deleted succesfully'}, status=200)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
