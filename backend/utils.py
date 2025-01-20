import time
from functools import wraps

from django.shortcuts import get_object_or_404
from rest_framework.response import Response

from backend.models import MachineState, MachineHistory


def focus_machine_simulation():
    time.sleep(2)


def move_machine_simulation():
    time.sleep(3)


def get_machine_state():
    """Get the current machine state object."""
    return get_object_or_404(MachineState, pk=1)


def get_machine_history():
    """Get all machine history entries."""
    return MachineHistory.objects.all().values("x_position", "y_position", "status")


def create_response(state, history=None):
    """Create a standardized response format."""
    if history is None:
        history = get_machine_history()

    return {
        "current": {
            "x": state.x_position,
            "y": state.y_position,
            "status": state.status,
        },
        "history": list(history),
    }


def require_idle_state(view_func):
    """Decorator to check if machine is in idle state."""

    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        state = get_machine_state()
        if state.status != "idle":
            return Response({"error": "Machine is busy"}, status=400)
        return view_func(request, *args, **kwargs)

    return wrapper


def update_machine_state(state, status=None, x_position=None, y_position=None):
    """Update machine state with given parameters."""
    if status is not None:
        state.status = status
    if x_position is not None:
        state.x_position = x_position
    if y_position is not None:
        state.y_position = y_position
    state.save()


def create_history_entry(x_position, y_position, status):
    """Create a new history entry."""
    return MachineHistory.objects.create(
        x_position=x_position, y_position=y_position, status=status
    )
