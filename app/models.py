
from django.db import models


class Observer(models.Model):
    location = models.CharField(max_length=512)
    min = models.IntegerField()
    max = models.IntegerField()
    avg = models.IntegerField()
    halymin = models.IntegerField(default=None, null=True)
    halymax = models.IntegerField(default=None, null=True)


class Observations(models.Model):
    measurement = models.IntegerField()
    moment = models.DateField()
    observer = models.ForeignKey(Observer, default=None)
