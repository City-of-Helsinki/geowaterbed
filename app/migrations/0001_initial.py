# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Observations',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('measurement', models.IntegerField()),
                ('moment', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Observer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('location', models.CharField(max_length=512)),
                ('min', models.IntegerField()),
                ('max', models.IntegerField()),
                ('avh', models.IntegerField()),
                ('halymin', models.IntegerField()),
                ('halymax', models.IntegerField()),
            ],
        ),
    ]
