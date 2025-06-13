from django.urls import path
from .views import Register,Login,protected_view

urlpatterns = [
    path('register/',Register.as_view(),name="user-register"),
    path('login/',Login.as_view()),
    path('protected/',protected_view),
]
