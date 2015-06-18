
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'observers', views.ObserverViewSet)

from django.conf.urls import include, url

urlpatterns = [
    url(r'(.*)/', views.detail),
    url(r'^', views.index)
]