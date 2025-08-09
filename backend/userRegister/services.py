from django.conf import settings
from django.shortcuts import redirect
from django.core.exceptions import ValidationError
from typing import Dict, Any
import requests
import jwt

GET_ACCESS_TOKEN_OBTAIN_URL="https://oauth2.googleapis.com/token"
GOOGLE_USER_INFO_URL='https://www.googleapis.com/auth/userinfo'
LOGIN_URL=f"{settings.BASE_APP_URL}/auth/login"