from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.exceptions import ValidationError
from apps.users.api.serializers import CustomTokenObtainPairSerializer, UserSerializer, UserCreateSerializer
from apps.users.services.user_service import UserCreationService
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserCreateSerializer
from django.db import transaction
User = get_user_model()

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    @method_decorator(cache_page(60*5))  
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60*2))  
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UserCreateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return super().get_permissions()

    def create(self, request):
        """
        Create either a system user or client user based on provided data
        """
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            with transaction.atomic():
                user_data = serializer.validated_data
                client = user_data.get('client_id')
                role_id = user_data.get('role_id')
                
                if client:
                    # Create client user
                    user = UserCreationService.create_client_user(
                        creator=request.user,
                        client=client,
                        user_data=user_data
                    )
                else:
                    # Create system user
                    user = UserCreationService.create_system_user(
                        creator=request.user,
                        user_data=user_data,
                        role_id=role_id
                    )
                
                return Response(
                    UserSerializer(user).data,
                    status=status.HTTP_201_CREATED
                )
                
        except ValidationError as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"detail": "An error occurred while creating user"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )