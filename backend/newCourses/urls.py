from django.urls import path,include
from .views import Course_creation,GetAllCourses,GetCourse,GetCourses
# from .views import UpdateEnrollment
from rest_framework.routers import DefaultRouter

router=DefaultRouter()
router.register(r'create_course',Course_creation,basename='create_course')
router.register(r'all_courses',GetCourses,basename='get_course')

urlpatterns = [
    path('',include(router.urls)),
    path('my_courses/',GetAllCourses.as_view()),
    path('course/',GetCourse.as_view()),
    # path('enroll/<int:id>/',UpdateEnrollment.as_view())
]
