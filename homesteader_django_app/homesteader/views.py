from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import ensure_csrf_cookie


def index(request):

    return render(request, 'index.html')


@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get("password")
    email = request.data.get('email')
    password_match = request.data.get('password_match')
    # make sure all fields are not blank
    if not username or not password or not email:
        return Response({"Message": "All fields required"}, status=status.HTTP_400_BAD_REQUEST)
    # make sure passwords match
    elif password != password_match:
        return Response({"Message": "Error creating account, please try again"}, status=status.HTTP_406_NOT_ACCEPTABLE)
    # make sure username isnt taken
    elif User.objects.filter(username=username).exists():
        return Response({"Message": "Username is taken"}, status=status.HTTP_400_BAD_REQUEST)
    # make sure email isnt used already
    elif User.objects.filter(email=email).exists():
        return Response({"Message": "Email address already in use"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.create_user(
            username=username, password=password, email=email)
        return Response({"Message": "Created Succesfully"}, status=status.HTTP_201_CREATED)
    except ValidationError:
        return Response({"Message": str(ValidationError)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception:
        return Response({"Message": "Something went wrong when creating new user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@ensure_csrf_cookie
@api_view(['POST'])
def login_api(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        return Response({"Message": "Login Succesful", "success": True}, status=status.HTTP_200_OK)
    else:
        return Response({"Message": "Invalid Credentials", "success": False}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
def logout_api(request):
    logout(request)
    return Response({"Message": "Logout Successful", "success": True}, status=status.HTTP_200_OK)


@api_view(['GET'])
def is_authenticated(request):
    if request.user.is_authenticated:
        return Response({"Message": "User is authenticated", "success": True})
    else:
        return Response({"Message": "User is not authenticated", "success": False})
