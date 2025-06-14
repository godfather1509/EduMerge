from django.contrib.auth.forms import UserChangeForm,UserCreationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        # Meta class is a special class used to modify metadata 
        # Metadata means “data about data.” 
        # It gives information about the main data — like a label or description that helps you understand or manage the data better
        model=CustomUser
        fields=('first_name','last_name','email','role','phone_no')

class CustomChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model=CustomUser
        fields=('first_name','last_name','email','role','phone_no')