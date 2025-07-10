from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.exceptions import ValidationError
from apps.users.api.serializers import CustomTokenObtainPairSerializer, UserSerializer
from apps.users.services.user_service import UserCreationService

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    @method_decorator(cache_page(60*5))  
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60*2))  
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class CompanyUserCreateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        try:
            user_data = request.data.get('user', {})
            individual_data = request.data.get('individual', {})
            
            user = UserCreationService.create_company_user(
                creator=request.user,
                user_data=user_data,
                individual_data=individual_data
            )
            
            return Response(
                UserSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        except PermissionError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_403_FORBIDDEN
            )
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'An unexpected error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )