from django.urls import path
from .views import Register,Login,protected_view,Verify_email,Bookmark

urlpatterns = [
    path('register/',Register.as_view(),name="user-register"),
    path('login/',Login.as_view()),
    path('forgotPassword/',Verify_email.as_view()),
    path('bookmark/',Bookmark.as_view()),
    path('protected/',protected_view),
]
