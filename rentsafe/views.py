from django.shortcuts import redirect
from inertia import render
from rentsafe.models import Company

def index(request):
    user = request.user
    # Check whether the user is logged in or not
    if user.is_authenticated:
        if user.user_type == 1:
            # for external users
            return redirect("clients_home")
        elif user.user_type == 2:
            # for internal users
            return redirect("admin_home")
        elif user.user_type == 3:
            # for internal agents
            company = Company.objects.filter(id=user.company).first()
            if company:
                if company.registration_name.lower() == "fincheck":
                    return redirect("agent_home")
                else:
                    return redirect("clients_home")
    return redirect('login') 

def in_development(request):
    return render(request, "PageInDevelopment")