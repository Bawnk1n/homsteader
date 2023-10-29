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
            return JsonResponse({"Message": "Created Succesfully"}, status=status.HTTP_201_CREATED)
        except ValidationError:
            return JsonResponse({"Message": str(ValidationError)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return JsonResponse({"Message": "Something went wrong when creating new user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        return Response({"Message": "User is authenticated", "success": True})
    else:
        return Response({"Message": "User is not authenticated", "success": False})


# @login_required
def save_garden(request):
    print('here')
    if request.method == 'POST':
        try:
            with transaction.atomic():
                garden_object = json.loads(
                    request.body.decode('utf-8'))
                garden = Garden.objects.create(user=request.user)
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
                                'plantingIntructions', ''),
                            when_to_plant=plant.get('whenToPlant', ''),
                            first_yield=plant.get('firstYield', ''),
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
        print('passed')
        try:
            user_garden = Garden.objects.get(user=request.user)
        except Garden.DoesNotExist:
            return JsonResponse({"status": 'fail', 'message': 'user has no garden'})
        recreated_garden = {}
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
                                      'numberOfPlants': plant.number_of_plants,
                                      'generalTipsAndTricks': plant.general_tips_and_tricks,
                                      'littleKnownFact': plant.little_known_fact,
                                      'advancedGardeningTip': plant.advanced_gardening_tip
                                      }
                        container_dict['plants'].append(plant_dict)
                recreated_garden['containers'].append(container_dict)

        print('user_garden: ', user_garden)

        return JsonResponse({'status': 'success', 'garden': recreated_garden, 'message': 'Garden successfully retrieved'})
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated'})
