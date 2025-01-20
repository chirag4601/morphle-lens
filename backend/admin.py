from django.contrib import admin

from backend.models import MachineState

@admin.register(MachineState)
class MachineStateAdmin(admin.ModelAdmin):
    list_display = ('x_position',)


