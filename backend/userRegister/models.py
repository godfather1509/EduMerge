from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as trans
from .manager import CustomUserManager

class Course(models.Model):
    course_name=models.CharField(max_length=50)
    date=models.DateField()
    description=models.TextField(max_length=100)
    instructor=models.CharField(max_length=50)
    def __str__(self):
        return self.course_name
    
class Modules(models.Model):
    course=models.ForeignKey(Course,on_delete=models.CASCADE,related_name="modules")
    module_name=models.CharField(max_length=50)
    description=models.CharField(max_length=100,blank=True)
    order=models.PositiveIntegerField(default=0)
    class Meta:
        ordering=['order']
    
    def __str__(self):
        return f"{self.order}.{self.module_name}"
    

class CustomUser(AbstractUser):
    ROLE_CHOICE=[
        ("student","STUDENT"),
        ("instructor","INSTRUCTOR"),
        ("admin","ADMIN")
        ]
    username=None
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

    def __str__(self):
        return "{}".format(self.first_name)
