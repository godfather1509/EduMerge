from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from .serializer import (
    RegisterUserSerializer,
    LoginSerializer,
    VerifyEmailSerializer,
    UpdatePassword,
)
from django.contrib.auth import get_user_model
from rest_framework import status
from django.shortcuts import get_object_or_404

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
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            user = authenticate(username=email, password=password)
            if user is None:
                return Response(
                    {"message": "Invalid Credentials", "errors": serializer.errors},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            refresh = RefreshToken.for_user(user)
            if user_details.role == "admin":
                return Response(
                    {"message": "Not Autherized", "errors": serializer.errors},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "role": user_details.role,
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )


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
        user=get_object_or_404(User,email=data["email"])
        serializer = UpdatePassword(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                        "message":"Password updated succesfully",
                        "data":serializer.data
                        },
                            status=status.HTTP_200_OK)
        return Response(serializer.errors)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": "You have access!"})
