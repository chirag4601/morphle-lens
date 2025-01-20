from django.contrib.auth.decorators import login_required
from django.shortcuts import render


def front(request, *args, **kwargs):
    return render(request, "frontend.html")
