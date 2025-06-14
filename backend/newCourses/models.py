from django.db import models
from django.contrib.auth import get_user_model

User=get_user_model()


class Course(models.Model):
    course_name=models.CharField(max_length=50)
    date=models.DateField()
    description=models.TextField(max_length=100)
    instructor=models.ForeignKey(User,on_delete=models.DO_NOTHING,related_name="instructor")
    def __str__(self):
        return self.course_name
    
class Module(models.Model):
    course=models.ForeignKey(Course,on_delete=models.CASCADE,related_name="modules")
    module_name=models.CharField(max_length=50)
    description=models.CharField(max_length=100,blank=True)
    order=models.PositiveIntegerField(default=0)
    class Meta:
        ordering=['order']
    
    def __str__(self):
        return f"{self.order}.{self.module_name}"