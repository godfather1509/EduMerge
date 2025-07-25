from django.urls import path,include
from newCourses.views import GetInstructor

urlpatterns = [
    path('auth/',include('userRegister.urls')),
    path('upload/',include('newCourses.urls')),
    path('scrape_courses/',include('scrapper.urls')),
    path('instructors/',GetInstructor.as_view())
]
