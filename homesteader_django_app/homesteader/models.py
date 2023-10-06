from django.db import models
from django.contrib.auth.models import User


class Garden(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    width = models.IntegerField()
    height = models.IntegerField()
    climate = models.CharField(max_length=155)


class Plant(models.Model):
    name = models.CharField(max_length=75)


class GardenPlant(models.Model):
    garden = models.ForeignKey(Garden, on_delete=models.CASCADE)
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE)
    # all info returned from the API call
    quantity = models.IntegerField()
    planting_instructions = models.CharField(max_length=310)
    when_to_plant = models.CharField(max_length=255)
    first_yield = models.CharField(max_length=255)
    tips_and_tricks = models.CharField(max_length=255)
    little_known_fact = models.CharField(max_length=255)
    advanced_tip = models.CharField(max_length=255)


class Container(models.Model):
    garden = models.ForeignKey(Garden, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)  # ie Raised Bed, Large Pot
    width = models.IntegerField()  # in ft
    height = models.IntegerField()  # in ft
    diameter = models.IntegerField()  # in inches
    volume = models.CharField(max_length=50)  # ex: 15 (litres)
