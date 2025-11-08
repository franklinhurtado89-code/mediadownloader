from django.urls import path

from .views import home_view, info_view

urlpatterns = [
    path('', home_view),
    path('info/', info_view, name='info'),
]