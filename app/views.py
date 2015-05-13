from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets

from .models import Observer
from .serializers import ObserverSerializer


class ObserverViewSet(viewsets.ModelViewSet):
    queryset = Observer.objects.all()
    serializer_class = ObserverSerializer

