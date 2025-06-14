from django.shortcuts import render
from .serializer import CourseSerializer
from rest_framework.viewsets import ModelViewSet
from .models import Course

class Course_creation(ModelViewSet):
    serializer_class=CourseSerializer
    queryset=Course.objects.all()
# Create your views here.
