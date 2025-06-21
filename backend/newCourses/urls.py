from django.urls import path,include
from .views import Course_creation,GetAllCourses
from rest_framework.routers import DefaultRouter

router=DefaultRouter()
router.register(r'create_course',Course_creation,basename='create_course')

urlpatterns = [
    path('',include(router.urls)),
    path('courses/',GetAllCourses.as_view())
]
