# Generated by Django 5.1.7 on 2025-06-14 01:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userRegister', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='serial_number',
        ),
    ]
