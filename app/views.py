from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets

from .models import Observations
from .serializers import ObservationSerializer


class ObservationViewSet(viewsets.ModelViewSet):
    queryset = Observations.objects.all()
    serializer_class = ObservationSerializer

