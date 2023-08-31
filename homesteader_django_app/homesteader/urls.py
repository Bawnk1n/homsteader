from django.contrib import admin
from django.urls import path, re_path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('loginapi/', views.login_api, name='login_api'),
    path('logoutapi/', views.logout_api, name='logout_api'),
    path('registerapi/', views.register, name='register_api'),
    path('authenticateapi/', views.is_authenticated, name='authenticate_api'),
    path('', views.index, name='index'),
    re_path(r'^.*', views.index, name='index'),
]
