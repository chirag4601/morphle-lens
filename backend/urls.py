from django.urls import path

from . import views

urlpatterns = [
    path("api/state/", views.get_state),
    path("api/move/", views.move_machine),
    path("api/focus/", views.focus_machine),
    path("api/reset/", views.reset_machine),
]
