# pylint: disable=unused-wildcard-import, wildcard-import
from django.contrib.auth.decorators import login_required
import inertia
from rentsafe.decorators import *
from rentsafe.models import *
from rentsafe.serializers import *
from rentsafe.helper import *


@login_required
@agents_required
def agent_home(request):
    return inertia.render(request, "Admin/Dashboard", props={})
