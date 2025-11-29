from django.urls import path,include
from .views import WebScraper,SearchScraper, NewWebScrapper
from rest_framework.routers import DefaultRouter

router=DefaultRouter()

urlpatterns = [
    path('courses/',WebScraper.as_view()),
    path('new_courses/',NewWebScrapper.as_view()),
    path('courses/<str:query>/',SearchScraper.as_view())
]
