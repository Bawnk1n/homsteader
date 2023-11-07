from django.contrib import admin
from django.urls import path, re_path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('loginapi', views.login_api, name='login_api'),
    path('gettoken', views.get_csrf_token, name="get_csrf_token"),
    path('logoutapi', views.logout_api, name='logout_api'),
    path('register', views.register, name='register'),
    path('is_authenticated', views.is_authenticated, name='is_authenticated'),
    path('save_garden', views.save_garden, name="save_garden"),
    path('retrieve_garden', views.retrieve_garden, name="retrieve_garden"),
    path('set_plant_start_date', views.set_plant_start_date,
         name="set_plant_start_date"),
    path('delete_garden', views.delete_garden, name="delete_garden"),
    path('', views.index, name='index'),
    re_path(r'^.*', views.index, name='index'),
]
