from django.contrib import admin
from .models import Course,Module
from userRegister.admin import custom_admin_site
from django.contrib.auth import get_user_model

User=get_user_model()

class ModuleLine(admin.TabularInline):
    model=Module
    extra=1

class CourseAdmin(admin.ModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name=="instructor":
            kwargs["queryset"]=User.objects.filter(role="instructor")
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    list_display=('id','course_name','date','instructor',"no_of_modules","total_enrolled")
    inlines=[ModuleLine]

custom_admin_site.register(Course,CourseAdmin)

