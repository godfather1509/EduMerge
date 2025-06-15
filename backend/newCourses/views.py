from django.shortcuts import render
from .serializer import CourseSerializer
from rest_framework.viewsets import ModelViewSet
from .models import Course
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response

User=get_user_model()

class Course_creation(ModelViewSet):
    serializer_class=CourseSerializer
    queryset=Course.objects.all()
# Create your views here.

class GetInstructor(APIView):
    def get(self,request):
        instructors=User.objects.filter(role="instructor")
        data = []
        for instructor in instructors:
            data.append({
                "id": instructor.id,
                "name": f"{instructor.first_name} {instructor.last_name}".strip(),
                "email":f"{instructor.email}"
            })
        return Response(data, status=status.HTTP_200_OK)
