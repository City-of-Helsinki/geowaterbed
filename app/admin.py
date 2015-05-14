from django.contrib import admin
from .models import Observer


class ObserverAdmin(admin.ModelAdmin):
    pass


admin.site.register(Observer, ObserverAdmin)