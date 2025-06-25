from django.shortcuts import render
from .serializer import CourseSerializer, GetAllCoursesSerializer
# from .serializer import EnrollSerializer
from rest_framework.viewsets import ModelViewSet
from .models import Course
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

User = get_user_model()


class Course_creation(ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()


class GetCourses(ModelViewSet):
    serializer_class = GetAllCoursesSerializer
    queryset = Course.objects.all()


class GetInstructor(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        instructors = User.objects.filter(role="instructor")
        data = []
        for instructor in instructors:
            data.append(
                {
                    "id": instructor.id,
                    "name": f"{instructor.get_full_name()}".strip(),
                    "email": f"{instructor.email}",
                }
            )
        return Response(data, status=status.HTTP_200_OK)


class GetAllCourses(APIView):
    permission_classes = [IsAuthenticated]

    # permission_classes = [AllowAny]
    def get(self, request):
        instructor = request.query_params.get("course_instructor")
        # to get query from api url
        if not instructor:
            return Response(
                {"error": "Instructor id is requierd"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        courses = Course.objects.filter(instructor=instructor)
        serializer = GetAllCoursesSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetCourse(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        courseId = request.query_params.get("course")
        courseId = int(courseId)
        if not courseId:
            return Response({"error": "No course ID"})
        course = Course.objects.filter(id=courseId)
        serializer = GetAllCoursesSerializer(course, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)