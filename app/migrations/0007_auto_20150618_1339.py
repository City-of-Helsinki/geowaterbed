# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_auto_20150612_1637'),
    ]

    operations = [
        migrations.AddField(
            model_name='observer',
            name='loc_x',
            field=models.CharField(default=None, max_length=128, null=True),
        ),
        migrations.AddField(
            model_name='observer',
            name='loc_y',
            field=models.CharField(default=None, max_length=128, null=True),
        ),
    ]
