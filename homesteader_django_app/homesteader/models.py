from django.db import models


class Garden(models.Model):
    name = models.CharField(max_length=255)
    size = models.CharField(max_length=50)


class Plant(models.Model):
    name = models.CharField(max_length=255)
