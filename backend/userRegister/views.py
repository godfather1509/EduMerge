from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout
from django.http import HttpResponse
from .serializer import (
    RegisterUserSerializer,
    LoginSerializer,
    VerifyEmailSerializer,
    BookmarkSerializer,
    UpdatePassword,
    OAuthSerializer
)
from django.contrib.auth import get_user_model
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Bookmark as bk
from .services import get_user_data
import urllib.parse
from django.shortcuts import redirect


User = get_user_model()
# using 'get_user_model' we don't have to import model from models.py everytime, to use this we need to register our custom user in settings.py


class Register(CreateAPIView):
    # CreatePIView only provides POST request and since we only need to send data from frontend we are using this class
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer


# Create your views here.
class Login(APIView):

    def post(self, request):
        data = request.data
        serializer = LoginSerializer(data=data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]
            user_details = User.objects.filter(email=email).first()
            if user_details is None:
                return Response(
                    {"message": "User Does Not Exists", "errors": serializer.errors},
                    status=status.HTTP_404_NOT_FOUND,
                )
            if user_details.role == "admin":
                return Response(
                    {"message": "Not Autherized", "errors": serializer.errors},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            user = authenticate(username=email, password=password)
            if user is None:
                return Response(
                    {"message": "Invalid Credentials", "errors": serializer.errors},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            refresh = RefreshToken.for_user(user)
            bookmarks = bk.objects.filter(user=user_details)
            bookmark_serializer = BookmarkSerializer(bookmarks, many=True).data
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "role": user_details.role,
                    "userId": user_details.id,
                    "gender": user_details.gender,
                    "email": user_details.email,
                    "name": user_details.get_full_name(),
                    "bookmarks": bookmark_serializer,
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )

class Oauth_Handler(APIView):

    def get(self,request):
        serializer=OAuthSerializer(data=request.GET)
        serializer.is_valid(raise_exception=True)

        valid_data=serializer.validated_data
        user_data=get_user_data(valid_data)
        user=User.objects.get(email=user_data['email'])
        refresh = RefreshToken.for_user(user)

        payload={
            "access_token":refresh.access_token,
            "referesh_token":refresh,
            "first_name":user_data['first_name'],
            "last_name":user_data['last_name']
        }

        frontend_url=f"http://localhost:5173/callback/?{urllib.parse.urlencode(payload)}"
        return redirect(frontend_url)

class Verify_email(APIView):

    def post(self, request):
        data = request.data
        serializer = VerifyEmailSerializer(data=data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            user_details = User.objects.filter(email=email).first()
            if user_details is None:
                return Response(
                    {"message": "User Does Not Exists", "errors": serializer.errors},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            if user_details.role == "admin":
                return Response(
                    {"message": "Not Autherized", "errors": serializer.errors},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            return Response(
                {
                    "role": user_details.role,
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request):
        data = request.data
        user = get_object_or_404(User, email=data["email"])
        serializer = UpdatePassword(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Password updated succesfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors)


class Bookmark(APIView):

    def get(self, request):
        email = request.query_params.get("email")
        user = User.objects.get(email=email)
        # this gives single object from database
        bookmarks = bk.objects.filter(user=user)
        # this gives multiple objects from database
        serializer = BookmarkSerializer(bookmarks, many=True).data
        if serializer:
            return Response(
                {
                    "bookmarks": serializer,
                },
                status=status.HTTP_200_OK,
            )
        return Response(status=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        data = request.data
        user = get_object_or_404(User, email=data["email"])
        serializer = RegisterUserSerializer(user, data=data, partial=True)
        # user has old data(instance in serializer)
        # data is new data(data in serializer)
        # partial=True means partial updation of data is allowed
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Course Bookmarked succesfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors)

    def delete(self, request):
        data = request.data
        obj = bk.objects.filter(course_name_bookmark=data["bookmarkName"]).first()
        print(obj)
        if obj:
            obj.delete()
            return Response(
                {"message": "Bookmark Deleted succesfully"}, status=status.HTTP_200_OK
            )
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

class LogOut(APIView):

    def get(self, request):
        logout(request)
        # this will extract JWT token from sent request and deactivate that token effectively logging out that user
        return HttpResponse('200')