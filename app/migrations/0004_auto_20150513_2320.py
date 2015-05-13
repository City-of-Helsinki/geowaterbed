# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_auto_20150513_2315'),
    ]

    operations = [
        migrations.AlterField(
            model_name='observer',
            name='halymax',
            field=models.IntegerField(default=None, null=True),
        ),
        migrations.AlterField(
            model_name='observer',
            name='halymin',
            field=models.IntegerField(default=None, null=True),
        ),
    ]
