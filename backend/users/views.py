from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

from .models import User
from .serializers import UserSerializer, UserCreateUpdateSerializer, CustomTokenObtainPairSerializer, ChangePasswordSerializer
from .permissions import IsAdminUserRole, IsSelfOrAdmin

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not user.check_password(old_password):
                return Response({'detail': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password updated successfully! Please use your new password for future logins.'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    permission_classes = [IsAdminUserRole]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UserCreateUpdateSerializer
        return UserSerializer

    def get_queryset(self):
        if self.request.user.is_admin_role:
            return User.objects.all().order_by('-date_joined')
        return User.objects.filter(id=self.request.user.id)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserRole])
    def terminate(self, request, pk=None):
        employee = self.get_object()
        employee.is_active = False
        employee.status = User.Status.TERMINATED
        employee.save()
        return Response({
            'message': f'Employee {employee.get_full_name()} ({employee.employee_id}) has been terminated.',
            'data': UserSerializer(employee).data
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserRole])
    def reactivate(self, request, pk=None):
        employee = self.get_object()
        employee.is_active = True
        employee.status = User.Status.ACTIVE
        employee.save()
        return Response({
            'message': f'Employee {employee.get_full_name()} ({employee.employee_id}) has been reactivated.',
            'data': UserSerializer(employee).data
        })
