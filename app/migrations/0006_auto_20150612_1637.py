# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_auto_20150514_2248'),
    ]

    operations = [
        migrations.AlterField(
            model_name='observations',
            name='measurement',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='observer',
            name='avg',
            field=models.FloatField(verbose_name=b'average observed measurement'),
        ),
        migrations.AlterField(
            model_name='observer',
            name='halymax',
            field=models.FloatField(default=None, help_text=b'not available in all observers', null=True, verbose_name=b'variations in the higher region'),
        ),
        migrations.AlterField(
            model_name='observer',
            name='halymin',
            field=models.FloatField(default=None, help_text=b'not available in all observers', null=True, verbose_name=b'variations in the lower region'),
        ),
        migrations.AlterField(
            model_name='observer',
            name='max',
            field=models.FloatField(verbose_name=b'highest observed measurement'),
        ),
        migrations.AlterField(
            model_name='observer',
            name='min',
            field=models.FloatField(verbose_name=b'lowest observed measurement'),
        ),
    ]
