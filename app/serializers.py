
from rest_framework import serializers

from .models import Observations


class ObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observations

