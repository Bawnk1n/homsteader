# Generated by Django 4.2.3 on 2023-10-26 19:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Container',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('instructions', models.TextField()),
                ('useful_advice', models.TextField()),
                ('shopping_list', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Plant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('planting_instructions', models.TextField()),
                ('when_to_plant', models.CharField(max_length=100)),
                ('first_yield', models.CharField(max_length=100)),
                ('number_of_plants', models.IntegerField()),
                ('general_tips_and_tricks', models.TextField()),
                ('little_known_fact', models.TextField()),
                ('advanced_gardening_tip', models.TextField()),
                ('container', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='plants', to='homesteader.container')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Garden',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='container',
            name='garden',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='containers', to='homesteader.garden'),
        ),
        migrations.AddField(
            model_name='container',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]