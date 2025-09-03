from django.conf import settings
from django.shortcuts import redirect
from django.core.exceptions import ValidationError
from typing import Dict, Any
import requests
import jwt
from django.contrib.auth import get_user_model


GET_ACCESS_TOKEN_OBTAIN_URL="https://oauth2.googleapis.com/token"
GOOGLE_USER_INFO_URL='https://openidconnect.googleapis.com/v1/userinfo'
LOGIN_URL=f"{settings.BASE_APP_URL}/auth/login"
User = get_user_model()


def google_get_access_token(code:str, redirect_uri:str)->str:

    data={
        'code':code,
        'client_id':settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id'],
        'client_secret':settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['secret'],
        'redirect_uri': redirect_uri,
        'grant_type':'authorization_code'
    }

    response=requests.post(GET_ACCESS_TOKEN_OBTAIN_URL, data=data)
    if not response.ok:
        raise ValidationError("Could not get access token from google")

    access_token=response.json()['access_token']

    return access_token


def google_get_user_info(access_token: str) -> Dict[str, Any]:
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(GOOGLE_USER_INFO_URL, headers=headers)

    data = response.json()

    if not response.ok:
        raise ValidationError(f"Could not get user info from google: {data}")

    return data

def get_user_data(validated_data):

    domain=settings.BASE_APP_URL
    redirect_uri=f'{domain}auth/google/callback/'
    code=validated_data.get('code')
    error=validated_data.get('error')

    if error or not code:
        params=urlencode({'error':error})
        return redirect(f'{LOGIN_URL}?{params}')
    
    access_token=google_get_access_token(code=code, redirect_uri=redirect_uri)
    user_data=google_get_user_info(access_token=access_token)

    User.objects.get_or_create(
    email=user_data["email"],
    defaults={
        "first_name": user_data.get("given_name", ""),   # fallback empty string
        "last_name": user_data.get("family_name", ""),   # fallback empty string
        }
    )


    profile_data={
        'email': user_data['email'],
        'first_name':user_data.get('given_name'),
        'last_name': user_data.get('family_name')
    }

    return profile_data
