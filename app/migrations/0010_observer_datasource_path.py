# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_observer_address'),
    ]

    operations = [
        migrations.AddField(
            model_name='observer',
            name='datasource_path',
            field=models.URLField(default=None, null=True, verbose_name=b'location of observation data'),
        ),
    ]
