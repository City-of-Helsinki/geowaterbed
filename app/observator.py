# -*- coding: utf-8 -*-

import datetime, re
import requests

from .models import Observer, Observations
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.db.models import ObjectDoesNotExist

from collections import namedtuple

Measurement = namedtuple('Measurement', ['moment', 'measurement'])


def import_data():
    """
    Import data into database according to datasource_path in Observer objects
    and DATA_IMPORT_BASEURL from settings

    :return: None
    """

    location = getattr(settings, "DATA_IMPORT_BASEURL", None)
    if not location:
        raise ImproperlyConfigured("Data import needs DATA_IMPORT_BASEURL in settings")

    for obs in Observer.objects.all():
        try:
            r = requests.get(location + obs.datasource_path)
        except requests.exceptions.ConnectionError, e:
            print obs.datasource_path, e
            return False
        except requests.exceptions.Timeout, e:
            print obs.datasource_path, e
            return False

        data = process(r.content)
        save_obs(obs, data)


def save_obs(obs, data):

    obs.location = data['PISTE']
    obs.min = data['MIN']
    obs.max = data['MAX']
    obs.avg = data['KESKI']
    obs.halymin = data.get('HALYMIN', None)
    obs.halymax = data.get('HALYMAX', None)

    obs.save()

    try:
        point = obs.observations.latest('moment')
        latest = point.moment
    except ObjectDoesNotExist:
        latest = datetime.date.min

    for point in data['observations']:
        if latest < point.moment:
            dobs = Observations(
                moment=point.moment,
                measurement=point.measurement,
                observer=obs)
            dobs.save()


def process(doc):
    """
    Process data file into dictionary containing its fields
    and observations as Measurement
    :param doc: str
    :return: dict
    """

    resp = {"observations": []}
    lines = doc.splitlines()
    for l in lines:
        first, second = l.strip().split(" ")
        if first.isalpha():
            resp[first] = second
        else:
            try:
                dt = datetime.datetime.strptime(first, '%d.%m.%Y')
                d = dt.date()
                meas = Measurement(d, second)
                resp["observations"].append(meas)
            except ValueError, e:
                print "Datetime conversion error", doc, first
    return resp


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
                    d = dt.date()
                    meas = Measurement(d, second)
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


def get_coords(doc):
    coord_lines = open(doc).read().splitlines()
    coords = coordinator(coord_lines)
    update_coord(coords)


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
    pointers = {}
    for i in point_lines:
        name, x, y = reversed(i.split(" "))
        cursor.execute("select ST_AsText(ST_Transform(ST_GeomFromText('POINT(%s %s)', 3879), 4326))" % (x, y))
        res = cursor.fetchone()[0]
        m = re.search(r'POINT\((.*?)\)', res).group(1)
        gps_y, gps_x = m.split(" ")
        pointers[name] = [gps_x, gps_y]
    return pointers


def update_coord(coords):
    for item_id, item in coords.items():
        name = item_id.lower() + '.txt'
        print item_id, name
        d = Observer.objects.get(name=name)  # observator ids' are inconsistent
        d.loc_x = item[0]
        d.loc_y = item[1]
        d.save()


def update_addresses(addrs):
    for name, addr in addrs.items():
        try:
            obj = Observer.objects.get(name=name.lower() + '.txt')
        except:
            print name
            pass

        obj.address = addr
        obj.save()


POSTGRES_PROJECTION_SETTINGS = """
INSERT INTO "spatial_ref_sys" ("srid","auth_name","auth_srid","srtext","proj4text") VALUES (3879,'EPSG',3879,'PROJCS["ETRS89 / ETRS-GK25FIN",GEOGCS["ETRS89",DATUM["European_Terrestrial_Reference_System_1989",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6258"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4258"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",25],PARAMETER["scale_factor",1],PARAMETER["false_easting",25500000],PARAMETER["false_northing",0],AUTHORITY["EPSG","3879"],AXIS["Northing",NORTH],AXIS["Easting",EAST]]','+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ');
select ST_AsText(ST_Transform(ST_GeomFromText('POINT(25496807.262 6673221.252)', 3879), 4326));
"""

OBSERVATION_POINTS_ADDRESSES = {
    "6126_116O": "Orsiveden taso Helsingin Rautatieasemalla",
    "6126_484O": "Orsiveden taso Aleksis Kivenkatu 40:ssä",
    "6126_487O": "Orsiveden taso Dagmarinkatu 6:ssa",
    "6126_215O": "Orsiveden taso Aleksanterinkatu 36:ssa",
    "6126_219O": "Orsiveden taso Aleksanterinkatu 15:ssä",
    "6126_312O": "Orsiveden taso Urheilukatu 26:ssa",
    "6126_116P": "Pohjaveden taso Helsingin Rautatieasemalla",
    "6170_3P": "Pohjaveden taso Kravuntie 20:ssä",
    "6170_4P": "Pohjaveden taso Suopursuntie 6:ssa",
    "6126_100P": "Pohjaveden taso Kaisaniemessä",
    "6126_215P": "Pohjaveden taso Aleksanterinkatu 36:ssa",
    "6126_219P": "Pohjaveden taso Aleksanterinkatu 15:ssä",
    "10220_04P": "Pohjaveden taso Härkävaljakontie 16:ssa",
    "10409_01P": "Pohjaveden taso Pohjoisesplanadi 35:ssa",
    "11028_5P": "Pohjaveden taso Mannerheimintie 8:ssä",
    "11028_2P": "Pohjaveden taso Mannerheimintie 3:ssä",
    "11028_4P": "Pohjaveden taso Pohjoisesplanadi 29:ssa",
    "11028_6P": "Pohjaveden taso Mannerheimintie 20:ssä",
    "11028_7P": "Pohjaveden taso Mannerheimintie 1:ssä",
    "11028_3P": "Pohjaveden taso Kluuvikatu 7:ssä",
    "11163_1P": "Pohjaveden taso Mikonkatu 5:ssä",
    "6126_148P": "Pohjaveden taso Pohjoisesplanadi 25:ssa",
    "6126_382P": "Pohjaveden taso Havis Amandan patsaalla",
    "6126_384P": "Pohjaveden taso Haapatie 29:ssä",
    "6126_387P": "Pohjaveden taso Kotinummenpuistossa"
}