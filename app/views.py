from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets

from .models import Observer
from .serializers import ObserverSerializer


class ObserverViewSet(viewsets.ModelViewSet):
    """
    ## Observers information

     * Collecting observations from measurement points
     * Reporting all observations from all observers

    """
    queryset = Observer.objects.all()
    serializer_class = ObserverSerializer


def index(request):
    return render(request, "app/index.html", {'queryset': Observer.objects.all()})
