from rest_framework.serializers import ModelSerializer
from .models import Course, Module
from django.contrib.auth import get_user_model

User=get_user_model()

class ModuleSerializer(ModelSerializer):
    class Meta:
        model = Module
        fields = ["module_name", "video_url", "order"]


class CourseSerializer(ModelSerializer):
    modules=ModuleSerializer(many=True)
    class Meta:
        model = Course
        fields = ["course_name", "date", "description", "instructor", "no_of_modules","modules"]