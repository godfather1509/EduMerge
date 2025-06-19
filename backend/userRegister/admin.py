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
    # this will allow only those users which have 'is_staff' and 'is_active' set as true and role as 'admin'

custom_admin_site=CustomAdminSite(name='custom_admin')



class UserAdmin(UserAdmin):
# used to register custom user model on admin dashboard
    create_form=UserCreationForm
    form=UserChangeForm
    list_display=('id','first_name','last_name','email','role','phone_no') # display these fields in table
    list_filter=('role',) # filter users on the basis of role
    model=CustomUser

    fieldsets=((None,{'fields':('first_name','last_name','email','role','password','phone_no')}),)
    # This defines the layout of fields shown when editing an existing user in the Django admin

    add_fieldsets=((None,{'fields':('first_name','last_name','email','role','password1','password2','phone_no'),}),)
    # This is used when creating a new user in the Django admin
    # It differs from fieldsets to allow for extra logic like password confirmation.

    search_fields=('email','first_name','last_name') # user can be searched on the basis of these fields
    ordering=('first_name',) # users will be ordered on the basis of their first name


custom_admin_site.register(CustomUser,UserAdmin)
custom_admin_site.register(Group,GroupAdmin)
custom_admin_site.register(Token)
# Registering models with custom admin class
