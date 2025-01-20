from django.db import models


class MachineState(models.Model):
    x_position = models.IntegerField(default=0)
    y_position = models.IntegerField(default=0)
    status = models.CharField(max_length=10, default="idle")
    last_updated = models.DateTimeField(auto_now=True)


class MachineHistory(models.Model):
    x_position = models.IntegerField()
    y_position = models.IntegerField()
    status = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
