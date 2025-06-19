from django.contrib.auth.base_user import BaseUserManager

ROLE_CHOICE=["student","instructor","admin"]
class CustomUserManager(BaseUserManager):
    # used to define how the CustomUser model will create user and super user
    def create_user(self,email,password,**extra):
        if not email:
            raise ValueError("Email Not Entered")
        email=self.normalize_email(email).strip()
        first_name=extra.pop('first_name',"")
        last_name=extra.pop('last_name',"")
        role=extra.pop('role')
        phone_no=extra.pop('phone_no',"")
        if role not in ROLE_CHOICE:
            raise ValueError(f"Incorrect Role choose from {','.join(ROLE_CHOICE)}")
        if role=="admin":
            # did this so I can make superuser from admin dashboard as well
            extra.setdefault('is_staff',True)
            extra.setdefault('is_active',True)
            extra.setdefault('is_superuser',True)
        
        user=self.model(email=email,
                        first_name=first_name,
                        last_name=last_name,
                        role=role,
                        phone_no=phone_no,
                        **extra)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self,email,password,**extra):
        # this will get called only when we run createsuper command
        extra.setdefault('is_staff',True)
        extra.setdefault('is_active',True)
        extra.setdefault('is_superuser',True)
        extra.setdefault('phone_no',"00000")
        extra.pop('role')
        extra['role'] = "admin"
        return self.create_user(email,password,**extra)

