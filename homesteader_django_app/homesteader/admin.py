from django.contrib import admin
from django.contrib.auth.models import User
from .models import Garden, Container, Plant

admin.site.register(Garden)
admin.site.register(Container)
admin.site.register(Plant)
