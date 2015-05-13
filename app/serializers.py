
from rest_framework import serializers

from .models import Observations, Observer


class ObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observations

class ObserverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observer

