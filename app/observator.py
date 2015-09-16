import datetime, re

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

POSTGRES_PROJECTION_SETTINGS = """
INSERT INTO "spatial_ref_sys" ("srid","auth_name","auth_srid","srtext","proj4text") VALUES (3879,'EPSG',3879,'PROJCS["ETRS89 / ETRS-GK25FIN",GEOGCS["ETRS89",DATUM["European_Terrestrial_Reference_System_1989",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6258"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4258"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",25],PARAMETER["scale_factor",1],PARAMETER["false_easting",25500000],PARAMETER["false_northing",0],AUTHORITY["EPSG","3879"],AXIS["Northing",NORTH],AXIS["Easting",EAST]]','+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ');
select ST_AsText(ST_Transform(ST_GeomFromText('POINT(25496807.262 6673221.252)', 3879), 4326));
"""