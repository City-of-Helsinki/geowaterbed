# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0010_observer_datasource_path'),
    ]

    operations = [
        migrations.AlterField(
            model_name='observer',
            name='avg',
            field=models.FloatField(default=None, null=True, verbose_name=b'average observed measurement'),
        ),
        migrations.AlterField(
            model_name='observer',
            name='max',
            field=models.FloatField(default=None, null=True, verbose_name=b'highest observed measurement'),
        ),
        migrations.AlterField(
            model_name='observer',
            name='min',
            field=models.FloatField(default=None, null=True, verbose_name=b'lowest observed measurement'),
        ),
    ]
