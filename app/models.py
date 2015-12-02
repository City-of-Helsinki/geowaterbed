
from django.db import models

OBSERVER_TYPES = (
    ('orsi', 'Orsivesi'),
    ('pohja', 'Pohjavesi'),
)


class Observer(models.Model):
    name = models.CharField(max_length=512)
    datasource_path = models.URLField("location of observation data", default=None, null=True)
    location = models.CharField("Coordinates of observer", max_length=512, blank=True)
    loc_x = models.CharField(max_length=128, default=None, null=True, blank=True)
    loc_y = models.CharField(max_length=128, default=None, null=True, blank=True)
    min = models.FloatField("lowest observed measurement", default=None, null=True, blank=True)
    max = models.FloatField("highest observed measurement", default=None, null=True, blank=True)
    avg = models.FloatField("average observed measurement", default=None, null=True, blank=True)
    halymin = models.FloatField("variations in the lower region", default=None, null=True,
                                help_text="not available in all observers", blank=True)
    halymax = models.FloatField("variations in the higher region", default=None, null=True,
                                help_text="not available in all observers", blank=True)
    type = models.CharField("type of observation measure", max_length=10,
                            choices=OBSERVER_TYPES,
                            default=None, null=True)
    address = models.CharField("street address for observation points", max_length=200,
                               default=None, null=True, blank=True)

    def __unicode__(self):
        return self.location


class Observations(models.Model):
    measurement = models.FloatField()
    moment = models.DateField()
    observer = models.ForeignKey(Observer, default=None, related_name="observations")
