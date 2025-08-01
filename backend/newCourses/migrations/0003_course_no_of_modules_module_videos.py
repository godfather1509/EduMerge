# Generated by Django 5.1.7 on 2025-06-14 02:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('newCourses', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='no_of_modules',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='module',
            name='videos',
            field=models.FileField(default=1, upload_to='videos/'),
            preserve_default=False,
        ),
    ]
