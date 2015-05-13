# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_observations_observer'),
    ]

    operations = [
        migrations.RenameField(
            model_name='observer',
            old_name='avh',
            new_name='avg',
        ),
    ]
