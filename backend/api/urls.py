from django.urls import path,include

urlpatterns = [
    path('auth/',include('userRegister.urls')),
    path('upload/',include('newCourses.urls'))
]
