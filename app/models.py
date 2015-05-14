
from django.db import models


class Observer(models.Model):
    location = models.CharField("Coordinates of observer", max_length=512)
    min = models.IntegerField("lowest observed measurement")
    max = models.IntegerField("highest observed measurement")
    avg = models.IntegerField("average observed measurement")
    halymin = models.IntegerField("variations in the lower region", default=None, null=True,
                                  help_text="not available in all observers")
    halymax = models.IntegerField("variations in the higher region", default=None, null=True,
                                  help_text="not available in all observers")

    def __unicode__(self):
        return self.location


class Observations(models.Model):
    measurement = models.IntegerField()
    moment = models.DateField()
    observer = models.ForeignKey(Observer, default=None, related_name="observations")
