from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

from .serializers import (
    UserSerializer,
    UserCreateUpdateSerializer,
    ChangePasswordSerializer,
    CustomTokenObtainPairSerializer
)
from .permissions import IsAdminUserRole, IsSelfOrAdmin

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class EmployeeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsSelfOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin_role:
            return User.objects.all().order_by('-date_joined')
        return User.objects.filter(id=user.id)

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UserCreateUpdateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'destroy', 'terminate', 'reactivate']:
            return [IsAdminUserRole()]
        return super().get_permissions()

    @action(detail=True, methods=['post'])
    def terminate(self, request, pk=None):
        user = self.get_object()
        user.status = User.Status.TERMINATED
        user.is_active = False
        user.save()
        return Response({
            'status': 'success',
            'message': f'Employee {user.get_full_name()} account has been terminated.'
        })

    @action(detail=True, methods=['post'])
    def reactivate(self, request, pk=None):
        user = self.get_object()
        user.status = User.Status.ACTIVE
        user.is_active = True
        user.save()
        return Response({
            'status': 'success',
            'message': f'Employee {user.get_full_name()} account has been reactivated.'
        })

class ChangePasswordView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']

        if not user.check_password(old_password):
            return Response(
                {'detail': 'Current password does not match.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()
        return Response(
            {'message': 'Password updated successfully.'},
            status=status.HTTP_200_OK
        )
