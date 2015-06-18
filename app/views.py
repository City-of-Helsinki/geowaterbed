from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets

from .models import Observer
from .serializers import ObserverSerializer
import json, time

class ObserverViewSet(viewsets.ModelViewSet):
    """
    ## Observers information

     * Collecting observations from measurement points
     * Reporting all observations from all observers

    """
    queryset = Observer.objects.all()
    serializer_class = ObserverSerializer


def get_observations(queryset):
    first_dt = queryset.first().moment
    first = [first_dt.year, first_dt.month, first_dt.day]
    last_dt = queryset.last().moment
    last = [last_dt.year, last_dt.month, last_dt.day]
    series = {"data": [(time.mktime(i.moment.timetuple()) * 1000, i.measurement) for i in queryset.all().order_by('moment')],
              "first": first,
              "last": last}
    return series


def index(request):
    selected = Observer.objects.get(id=1)
    data = get_observations(selected.observations.all())
    data['avg'] = selected.avg
    data['selected'] = selected.name
    data['observators'] = {}
    for obs in Observer.objects.all():
        if not obs.loc_x and not obs.loc_y:
            # Empty location, not that useful for map
            continue
        data['observators'][obs.id] = {
            'name': obs.name,
            'location': {'x': obs.loc_x,
                         'y': obs.loc_y},
            'min': obs.min,
            'max': obs.max,
            'avg': obs.avg,
            'halymin': obs.halymin,
            'halymax': obs.halymax,
        }
    jsdata = json.dumps(data)
    return render(request, "app/index.html", {'queryset': Observer.objects.all(),
                                              'observations': jsdata})
