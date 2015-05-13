
from rest_framework import serializers

from .models import Observations, Observer


class ObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observations


class ObserverSerializer(serializers.ModelSerializer):
    observations = ObservationSerializer(many=True, read_only=True)

    class Meta:
        model = Observer
        fields = ("id", "location", "min", "max", "avg", "halymin", "halymax", "observations")

