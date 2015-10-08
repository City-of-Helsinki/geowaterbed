# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_observer_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='observer',
            name='address',
            field=models.CharField(default=None, max_length=200, null=True, verbose_name=b'street address for observation points'),
        ),
    ]
