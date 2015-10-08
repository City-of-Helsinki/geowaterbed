
from django.db import models

OBSERVER_TYPES = (
    ('orsi', 'Orsivesi'),
    ('pohja', 'Pohjavesi'),
)

class Observer(models.Model):
    name = models.CharField(max_length=512)
    location = models.CharField("Coordinates of observer", max_length=512)
    loc_x = models.CharField(max_length=128, default=None, null=True)
    loc_y = models.CharField(max_length=128, default=None, null=True)
    min = models.FloatField("lowest observed measurement")
    max = models.FloatField("highest observed measurement")
    avg = models.FloatField("average observed measurement")
    halymin = models.FloatField("variations in the lower region", default=None, null=True,
                                  help_text="not available in all observers")
    halymax = models.FloatField("variations in the higher region", default=None, null=True,
                                  help_text="not available in all observers")
    type = models.CharField("type of observation measure", max_length=10,
                            choices=OBSERVER_TYPES,
                            default=None, null=True)
    address = models.CharField("street address for observation points", max_length=200,
                               default=None, null=True)

    def __unicode__(self):
        return self.location


class Observations(models.Model):
    measurement = models.FloatField()
    moment = models.DateField()
    observer = models.ForeignKey(Observer, default=None, related_name="observations")
