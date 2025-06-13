from django.urls import path,include
from userRegister.admin import custom_admin_site

urlpatterns = [
    path('admin/', custom_admin_site.urls),
    path('api/',include('api.urls'))
]
