# Generated by Django 5.1.7 on 2025-06-23 17:25

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userRegister', '0007_remove_customuser_bookmark_bookmark_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookmark',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_bookmark', to=settings.AUTH_USER_MODEL),
        ),
    ]
