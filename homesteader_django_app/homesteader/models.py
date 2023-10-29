from django.db import models
from django.contrib.auth.models import User


class Garden(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Container(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    size = models.CharField(max_length=100)
    garden = models.ForeignKey(
        Garden, related_name='containers', on_delete=models.CASCADE)
    instructions = models.TextField()
    useful_advice = models.TextField()
    shopping_list = models.TextField()


class Plant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    container = models.ForeignKey(
        Container, related_name='plants', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    planting_instructions = models.TextField()
    when_to_plant = models.CharField(max_length=100)
    first_yield = models.CharField(max_length=100)
    number_of_plants = models.IntegerField()
    general_tips_and_tricks = models.TextField()
    little_known_fact = models.TextField()
    advanced_gardening_tip = models.TextField()
