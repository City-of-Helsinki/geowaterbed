from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest

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
    return {
        "data": [
            (time.mktime(i.moment.timetuple()) * 1000, i.measurement)
                for i in queryset.all().order_by('moment')
            ]
    }

def get_data(observator, span):

    if span == 'all':
        return get_observations(observator.observations.all())

    first_date = observator.observations.last().moment
    if not span:
        span = first_date + relativedelta(months=-DEFAULT_MONTH_SPAN)
    else:
        span = first_date + relativedelta(months=-span)

    return get_observations(observator.observations.filter(moment__gt=span))

def index(request):

    data = {}
    data['observators'] = {}

    observers = Observer.objects.all().order_by('address')
    for obs in observers:
        if not obs.loc_x and not obs.loc_y:
            # Empty location, not that useful for map
            continue
        data['observators'][obs.name] = {
            'name': obs.name,
            'location': {'x': obs.loc_x,
                         'y': obs.loc_y},
            'min': obs.min,
            'max': obs.max,
            'avg': obs.avg,
            'halymin': obs.halymin,
            'halymax': obs.halymax,
            'type': obs.type,
            'address': obs.address
        }
    selected = observers[0]
    data['selected'] = selected.name
    data['range'] = DEFAULT_MONTH_SPAN
    data['observators'][selected.name]['observations'] = get_data(selected, "all")

    jsdata = json.dumps(data)
    return render(request, "app/index.html", {'observators': observers,
                                              'observations': jsdata})

DEFAULT_MONTH_SPAN = 6

import datetime
from dateutil.relativedelta import relativedelta

def detail(request, name, span=None):
    if span and span is not 'all':
        try:
            span = int(span)
            if span > 50:
                raise ValueError
        except ValueError:
            return HttpResponseBadRequest('Value of span must be all or integer less than 50')
    selected = get_object_or_404(Observer, name=name)
    data = get_data(selected, "all")
    return JsonResponse(data)
