from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterUser(ModelSerializer):

    email = serializers.EmailField(required=True)
    role=serializers.CharField(required=True)
    # this overides DRF's own model validator with serializer's validator

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "role", "phone_no", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
            "email": {"required": True},
            "role": {"required": True},
            "phone_no": {"required": True},
        }

    def validate_email(self, value):
        value=value.lower()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with same email exists")
        return value

    def validate_role(self, value):
        if value == "admin":
            raise serializers.ValidationError("Cannot register as Admin")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data.pop("email").lower(),
            password=validated_data.pop("password"),
            # `create_user` hashes password automatically
            **validated_data
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
