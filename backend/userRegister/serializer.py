from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model
from .models import Bookmark

User = get_user_model()


class BookmarkSerializer(ModelSerializer):
    class Meta:
        model = Bookmark
        fields = [
            "course_name_bookmark",
            "bookmark_url"
        ]


class RegisterUserSerializer(ModelSerializer):

    email = serializers.EmailField(required=True)
    role = serializers.CharField(required=True)
    # this overides DRF's own model validator with serializer's custom validator
    bookmark = BookmarkSerializer(many=True, required=False)

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "email",
            "role",
            "qualification",
            "password",
            "gender",
            "bookmark",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
            "email": {"required": True},
            "role": {"required": True},
            "qualification": {"required": True},
            "gender": {"required": True},
        }

    def validate_email(self, value):
        value = value.lower()
        user_email = User.objects.filter(email=value)

        if self.instance:
            user_email = user_email.exclude(pk=self.instance.pk)

        if user_email.exists():
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

    def update(
        self, instance, data
    ):  # patching nested data as well as user data if required
        # instance is existing database object that we are updating
        # data is the new data we are updating
        instance.first_name = data.get("first_name", instance.first_name)
        instance.last_name = data.get("last_name", instance.last_name)
        instance.email = data.get("email", instance.email)
        instance.role = data.get("role", instance.role)
        instance.qualification = data.get("qualification", instance.qualification)
        instance.gender = data.get("gender", instance.gender)
        instance.save()
        bookmarks_data = data.pop("bookmark")
        #  patching nested models
        if bookmarks_data:
            for bookmark in bookmarks_data:
                Bookmark.objects.create(user=instance, **bookmark)
        return instance


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()


class UpdatePassword(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["password"]

    def update(self, instance, data):
        # instance is existing database object that we are updating
        password = data.get("password")
        if password:
            instance.set_password(password)  # hashes the password
        instance.save()
        return instance
