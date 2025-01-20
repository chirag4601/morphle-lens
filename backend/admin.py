from django.contrib import admin

from backend.models import MachineState, MachineHistory


@admin.register(MachineState)
class MachineStateAdmin(admin.ModelAdmin):
    list_display = ("x_position", "y_position", "status", "last_updated")


@admin.register(MachineHistory)
class MachineHistoryAdmin(admin.ModelAdmin):
    list_display = ("x_position", "y_position", "status", "created_at")
