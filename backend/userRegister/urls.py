from django.urls import path
from .views import Register,Login,Verify_email,Bookmark,Oauth_Handler

urlpatterns = [
    path('register/',Register.as_view(),name="user-register"),
    path('login/',Login.as_view()),
    path('forgotPassword/',Verify_email.as_view()),
    path('bookmark/',Bookmark.as_view()),
    path('auth/google/callback/',Oauth_Handler.as_view()),
]
