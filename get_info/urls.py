from django.urls import path

from .views import get_media_info

urlpatterns = [
    path('', get_media_info, name='get_media_info'),
]