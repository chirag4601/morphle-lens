from rest_framework.decorators import api_view
from rest_framework.response import Response

from backend.models import MachineHistory
from backend.utils import (
    focus_machine_simulation,
    move_machine_simulation,
    get_machine_state,
    create_response,
    update_machine_state,
    create_history_entry,
    require_idle_state,
)


@api_view(["GET"])
def get_state(request):
    """Get current machine state and history."""
    state = get_machine_state()
    return Response(create_response(state))


@api_view(["POST"])
@require_idle_state
def move_machine(request):
    """Move machine to target position."""
    target_x = request.data.get("x")
    target_y = request.data.get("y")

    state = get_machine_state()
    update_machine_state(state, status="moving")
    focus_machine_simulation()
    update_machine_state(state, status="idle", x_position=target_x, y_position=target_y)

    create_history_entry(target_x, target_y, "green")
    return Response(create_response(state))


@api_view(["POST"])
@require_idle_state
def focus_machine(request):
    """Focus machine at current position."""
    state = get_machine_state()
    update_machine_state(state, status="processing")

    move_machine_simulation()

    create_history_entry(state.x_position, state.y_position, "red")
    update_machine_state(state, status="idle")

    return Response(create_response(state))


@api_view(["POST"])
def reset_machine(request):
    """Reset machine to initial state and clear history."""
    MachineHistory.objects.all().delete()

    state = get_machine_state()
    update_machine_state(state, status="idle", x_position=0, y_position=0)

    return Response(create_response(state))
