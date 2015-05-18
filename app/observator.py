
import datetime

from .models import Observer, Observations

from collections import namedtuple

Measurement = namedtuple('Measurement', ['moment', 'measurement'])

def read(docs):
	data = {}
	for doc in docs:
		data[doc] = {"observations" : []}
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
	for item_id, obj in data:
		d, newd = Observer.objects.get_or_create(
			name=item_id,
			location=item['PISTE'],
			min=item['MIN'],
			max=item['MAX'],
			keski=item['KESKI'],
			halymin=item['HALYMIN'],
			halymax=item['HALYMAX'])
		for obs in obj['observations']:
			dobs = Observations(
				moment=obs.moment,
				measurement=obs.measurement,
				observer=d)
			dobs.save()
