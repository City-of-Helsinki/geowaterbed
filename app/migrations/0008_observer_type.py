# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_auto_20150618_1339'),
    ]

    operations = [
        migrations.AddField(
            model_name='observer',
            name='type',
            field=models.CharField(default=None, max_length=10, null=True, verbose_name=b'type of observation measure', choices=[(b'orsi', b'Orsivesi'), (b'pohja', b'Pohjavesi')]),
        ),
    ]
