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
    email=models.EmailField(trans('email address'),unique=True)
    # _('email address') or trans('email address') translates the field in set system language
    # e.g. in french email address heading will become "adresse e-mail"
    first_name=models.CharField(max_length=20,blank=True)
    last_name=models.CharField(max_length=20,blank=True)
    qualification=models.CharField(max_length=20,blank=True)
    role=models.CharField(max_length=20,choices=ROLE_CHOICE,blank=True)
    gender=models.CharField(max_length=10,blank=False)    
    
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['first_name','last_name','role','qualification','gender']
    # though these fields have blank=True while running createsuperuser command program will prompt us to enter these 
    # though it will be skipable
    objects=CustomUserManager() # overriding objects class here 
    class Meta:
        app_label='userRegister'
        # associated with userRegister app

    def __str__(self):
        return f"{self.id}-{self.get_full_name()}-{self.email}-{self.role}"
    

class Bookmark(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE,null=True,related_name="user_bookmark")
    course_name_bookmark=models.CharField(max_length=50,blank=True,null=True)
    # bookmark_url=models.URLField(blank=True,null=True)
    def __str__(self):
        return f"{self.id}-{self.course_name_bookmark}"