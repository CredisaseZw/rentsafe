import contextlib
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

User = get_user_model()

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'user_type', 'is_verified', 'client']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        authenticate_kwargs = {
            self.username_field: attrs[self.username_field],
            'password': attrs['password'],
        }

        with contextlib.suppress(KeyError):
            authenticate_kwargs['request'] = self.context['request']
        
        self.user = authenticate(**authenticate_kwargs)

        if self.user is None or not self.user.is_active:
            raise serializers.ValidationError(
                _("No active account found with the given credentials"),
                code='authorization',
            )

        if not self.user.is_verified:
            raise serializers.ValidationError(
                _("Account not verified. Please verify your account."),
                code='unverified',
            )

        refresh = self.get_token(self.user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserMiniSerializer(self.user).data,
        }

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_type'] = user.user_type
        token['client_id'] = user.client.id if hasattr(user, 'client') and user.client else None
        token['is_verified'] = user.is_verified
        return token

class UserSerializer(serializers.ModelSerializer):
    client = serializers.PrimaryKeyRelatedField(read_only=True)
    profile_object = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'user_type',
            'client', 'profile_object', 'is_verified',
            'last_login', 'date_joined'
        ]
        read_only_fields = ['last_login', 'date_joined']

    def get_profile_object(self, obj):
        if not obj.profile_object:
            return None
            
        from individuals.api.serializers import IndividualSerializer
        return IndividualSerializer(obj.profile_object).data