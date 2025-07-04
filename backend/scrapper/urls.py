from django.urls import path,include
from .views import WebScrapper,SearchScrapper
from rest_framework.routers import DefaultRouter

router=DefaultRouter()

urlpatterns = [
    path('courses/',WebScrapper.as_view()),
    path('courses/<str:query>',SearchScrapper.as_view())
]
