from django.contrib import admin
from .models import CustomUser
from django.contrib.auth.admin import UserAdmin
from .forms import UserChangeForm,UserCreationForm

from django.contrib.admin import AdminSite
from django.contrib.auth.admin import GroupAdmin
from django.contrib.auth.models import Group
from rest_framework.authtoken.models import Token

class CustomAdminSite(AdminSite):
    # this is used so that only certain users can see models in Admin dashboaard
    # AdminSite class is used to register models in admin dashboard
    # we inherit that class and make changes so that only user with Admin access can view and edit these models from dashboard
    site_header="EduMerge Admin Dashboard"
    site_title="Admin Dashboard"
    index_title="Welcome Admin"

    def has_permission(self, request):
        return super().has_permission(request) and request.user.role=="admin"
    # this will allow only those users which have 'is_staff' and 'is_active' set as true while creating users and role is set as 'admin'

custom_admin_site=CustomAdminSite(name='custom_admin')



class UserAdmin(UserAdmin):
    create_form=UserCreationForm
    form=UserChangeForm
    list_display=('first_name','last_name','email','role','phone_no')
    list_filter=('role',)
    model=CustomUser

    fieldsets=((None,{'fields':('first_name','last_name','role','password','phone_no')}),)
    add_fieldsets=((None,{'fields':('first_name','last_name','email','role','password1','password2','phone_no'),}),)

    search_fields=('email','first_name','last_name')
    ordering=('first_name',)


custom_admin_site.register(CustomUser,UserAdmin)
custom_admin_site.register(Group,GroupAdmin)
custom_admin_site.register(Token)
# Register your models here.