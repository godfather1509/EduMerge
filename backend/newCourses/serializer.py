from rest_framework.serializers import ModelSerializer
from .models import Course, Module
from django.contrib.auth import get_user_model

User = get_user_model()


class ModuleSerializer(ModelSerializer):
    # gets modules specific to a course
    class Meta:
        model = Module
        fields = ["module_name", "video_url", "order"]


class InstructorSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "role", "qualification", "email","gender"]


class CourseSerializer(ModelSerializer):
    # saves the course
    modules = ModuleSerializer(many=True)

    # many=True indicates there are going to be multiple instances of this class
    class Meta:
        model = Course
        fields = [
            "course_name",
            "date",
            "description",
            "instructor",
            "no_of_modules",
            "modules",
        ]

    def create(self, validated_data):
        modules_data = validated_data.pop("modules")
        course = Course.objects.create(**validated_data)
        for data in modules_data:
            module = Module.objects.create(course=course, **data)
        return course


class GetAllCoursesSerializer(ModelSerializer):
    # gets all courses from serializer
    instructor = InstructorSerializer(read_only=True)
    modules = ModuleSerializer(many=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "course_name",
            "date",
            "description",
            "instructor",
            "no_of_modules",
            "modules",
            "total_enrolled",
        ]