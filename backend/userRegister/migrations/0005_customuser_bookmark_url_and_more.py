# Generated by Django 5.1.7 on 2025-06-23 08:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userRegister', '0004_customuser_gender'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='bookmark_url',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='course_name_bookmark',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
