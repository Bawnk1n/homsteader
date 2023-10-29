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
    path('authenticateapi/', views.is_authenticated, name='authenticate_api'),
    path('save_garden', views.save_garden, name="save_garden"),
    path('retrieve_garden', views.retrieve_garden, name="retrieve_garden"),
    path('', views.index, name='index'),
    re_path(r'^.*', views.index, name='index'),
]
