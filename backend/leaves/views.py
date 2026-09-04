from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from users.permissions import IsAdminUserRole, IsSelfOrAdmin

class LeaveRequestViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsSelfOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin_role:
            return LeaveRequest.objects.all().select_related('employee').order_by('-applied_on')
        return LeaveRequest.objects.filter(employee=user).order_by('-applied_on')

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserRole])
    def approve(self, request, pk=None):
        leave_req = self.get_object()
        leave_req.status = LeaveRequest.Status.APPROVED
        leave_req.admin_notes = request.data.get('admin_notes', 'Approved by administrator.')
        leave_req.save()
        return Response({'message': 'Leave request approved successfully.', 'data': LeaveRequestSerializer(leave_req).data})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserRole])
    def reject(self, request, pk=None):
        leave_req = self.get_object()
        leave_req.status = LeaveRequest.Status.REJECTED
        leave_req.admin_notes = request.data.get('admin_notes', 'Rejected by administrator.')
        leave_req.save()
        return Response({'message': 'Leave request rejected.', 'data': LeaveRequestSerializer(leave_req).data})
