from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as trans
from .manager import CustomUserManager

class CustomUser(AbstractUser):
    ROLE_CHOICE=[
        ("student","STUDENT"),
        ("instructor","INSTRUCTOR"),
        ("admin","ADMIN")
        ]
    username=None
    serial_number = models.PositiveIntegerField(unique=True, editable=False, null=True, blank=True)
    email=models.EmailField(trans('email address'),unique=True)
    # _('email address') or trans('email address') translates the field in set system language
    # e.g. in french email address heading will become "adresse e-mail"
    first_name=models.CharField(max_length=20,blank=True)
    last_name=models.CharField(max_length=20,blank=True)
    phone_no=models.CharField(max_length=13,blank=True)
    role=models.CharField(max_length=20,choices=ROLE_CHOICE,blank=True)
    
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['first_name','last_name','role','phone_no']
    # though these fields have blank=True while running createsuperuser command program will prompt us to enter these 
    # though it will be skipable
    objects=CustomUserManager()
    class Meta:
        app_label='userRegister'

    def save(self, *args, **kwargs):
            if self.serial_number is None:
                last_serial = CustomUser.objects.aggregate(max=models.Max("serial_number"))["max"] or 0
                self.serial_number = last_serial + 1
            super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.serial_number}-{self.get_full_name()} - {self.email}"
