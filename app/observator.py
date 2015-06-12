import datetime

from .models import Observer, Observations

from collections import namedtuple

Measurement = namedtuple('Measurement', ['moment', 'measurement'])


def read(docs):
    data = {}
    for doc in docs:
        data[doc] = {"observations": []}
        for l in open(doc):
            first, second = l.strip().split(" ")
            if first.isalpha():
                data[doc][first] = second
            else:
                try:
                    dt = datetime.datetime.strptime(first, '%d.%m.%Y')
                    meas = Measurement(dt, second)
                    data[doc]["observations"].append(meas)
                except ValueError, e:
                    print "Datetime conversion error", doc, first
    return data


def save(data):
    for item_id, item in data.items():
        d, newd = Observer.objects.get_or_create(
            name=item_id,
            location=item['PISTE'],
            min=item['MIN'],
            max=item['MAX'],
            avg=item['KESKI'],
            halymin=item.get('HALYMIN', None),
            halymax=item.get('HALYMAX', None))
        for obs in item['observations']:
            dobs = Observations(
                moment=obs.moment,
                measurement=obs.measurement,
                observer=d)
            dobs.save()


def coordinator(point_lines):
    """
    For a list of lines from pisteetETRS.txt
    containing coordinates for observation stations
    converts coordinates to EPGS:3879 and
    saves them to db

    Uses custom SQL with Postgis things so beware

    :param point_lines:
    :return: None
    """

    from django.db import connection
    cursor = connection.cursor()
    for i in point_lines:
        name, x, y = reversed(i.split(" "))
        cursor.execute("select ST_AsText(ST_Transform(ST_GeomFromText('POINT(%s %s)', 3879), 4326))" % (x, y))
