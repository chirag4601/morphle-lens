from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def front(request, *args, **kwargs):
    return render(request, "index.html")
