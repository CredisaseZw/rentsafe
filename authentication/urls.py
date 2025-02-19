from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.login_view, name="login"),
    path("logout_user/", views.logout_user, name="logout"),
    path("forgot_password/", views.forgot_password, name="forgot_password"),
]
