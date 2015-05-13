
from django.db import models


class Observer(models.Model):
    location = models.CharField(max_length=512)
    min = models.IntegerField()
    max = models.IntegerField()
    avh = models.IntegerField()
    halymin = models.IntegerField()
    halymax = models.IntegerField()


class Observations(models.Model):
    measurement = models.IntegerField()
    moment = models.DateField()
    observer = models.ForeignKey(Observer, default=None)
