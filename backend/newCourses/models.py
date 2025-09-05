from django.db import models
from django.contrib.auth import get_user_model

User=get_user_model()


class Course(models.Model):
    course_name=models.CharField(max_length=50)
    avgRating=models.FloatField(default=0)
    date=models.DateField()
    description=models.TextField(max_length=100)
    instructor=models.ForeignKey(User,on_delete=models.DO_NOTHING,related_name="instructor")
    no_of_modules=models.IntegerField(blank=False)
    def __str__(self):
        return f"{self.id}-{self.course_name}"
    
class Module(models.Model):
    course=models.ForeignKey(Course,on_delete=models.CASCADE,related_name="modules")
    module_name=models.CharField(max_length=50,blank=False)
    video_url=models.CharField(max_length=1000,blank=False)
    order=models.PositiveIntegerField(default=0,blank=False)
    class Meta:
        ordering=['order']
    
    def __str__(self):
        return f"{self.order}.{self.module_name}"

class Review(models.Model):
    course= models.ForeignKey(Course,on_delete=models.CASCADE, related_name="reviews")
    title=models.CharField(max_length=50, blank=False)
    body=models.CharField(max_length=500, blank=False)
    rating=models.PositiveSmallIntegerField(blank=False)
    createdAt=models.DateField(auto_now=True, blank=False)