from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from .serializer import RegisterUser, LoginSerializer
from django.contrib.auth import get_user_model
from rest_framework import status


User = get_user_model()


class Register(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterUser


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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": "You have access!"})
