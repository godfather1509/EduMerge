from rest_framework.serializers import Serializer, FileField, ModelSerializer
from .models import Course, Module


class ModuleSerializer(ModelSerializer):
    class Meta:
        model = Module
        fields = ["module_name", "videos", "order"]


class CourseSerializer(ModelSerializer):
    modules=ModelSerializer(many=True)
    class Meta:
        model = Course
        fields = ["course_name", "date", "description", "instructor", "no_of_modules","modules"]
