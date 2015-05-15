# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_auto_20150513_2320'),
    ]

    operations = [
        migrations.AddField(
            model_name='observer',
            name='name',
            field=models.CharField(default='nimi', max_length=512),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='observations',
            name='observer',
            field=models.ForeignKey(related_name='observations', default=None, to='app.Observer'),
        ),
        migrations.AlterField(
            model_name='observer',
            name='avg',
            field=models.IntegerField(verbose_name=b'average observed measurement'),
        ),
        migrations.AlterField(
            model_name='observer',
            name='halymax',
            field=models.IntegerField(default=None, help_text=b'not available in all observers', null=True, verbose_name=b'variations in the higher region'),
        ),
        migrations.AlterField(
            model_name='observer',
            name='halymin',
            field=models.IntegerField(default=None, help_text=b'not available in all observers', null=True, verbose_name=b'variations in the lower region'),
        ),
        migrations.AlterField(
            model_name='observer',
            name='location',
            field=models.CharField(max_length=512, verbose_name=b'Coordinates of observer'),
        ),
        migrations.AlterField(
            model_name='observer',
            name='max',
            field=models.IntegerField(verbose_name=b'highest observed measurement'),
        ),
        migrations.AlterField(
            model_name='observer',
            name='min',
            field=models.IntegerField(verbose_name=b'lowest observed measurement'),
        ),
    ]
