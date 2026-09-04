from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from users.permissions import IsAdminUserRole, IsSelfOrAdmin
from users.models import Notification

class LeaveRequestViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsSelfOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin_role:
            return LeaveRequest.objects.all().select_related('employee').order_by('-created_at')
        return LeaveRequest.objects.filter(employee=user).order_by('-created_at')

    def perform_create(self, serializer):
        leave_obj = serializer.save(employee=self.request.user)
        # Notify Admin when an employee submits a leave request
        try:
            Notification.objects.create(
                title="New Leave Request",
                message=f"New {leave_obj.leave_type} leave request submitted by {self.request.user.get_full_name() or self.request.user.username}.",
                target="ADMIN",
                link_tab="admin-leaves",
                created_by=self.request.user
            )
        except Exception as e:
            pass

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserRole])
    def approve(self, request, pk=None):
        leave = self.get_object()
        leave.status = LeaveRequest.Status.APPROVED
        leave.admin_notes = request.data.get('admin_notes', 'Approved')
        leave.save()

        # Notify Employee when leave is approved
        try:
            Notification.objects.create(
                recipient=leave.employee,
                title="Leave Request Approved",
                message=f"Your {leave.leave_type} leave request from {leave.start_date} to {leave.end_date} has been approved.",
                target="EMPLOYEE",
                link_tab="leaves",
                created_by=request.user
            )
        except Exception:
            pass

        return Response({'status': 'Leave request approved.', 'data': LeaveRequestSerializer(leave).data})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserRole])
    def reject(self, request, pk=None):
        leave = self.get_object()
        leave.status = LeaveRequest.Status.REJECTED
        leave.admin_notes = request.data.get('admin_notes', 'Rejected')
        leave.save()

        # Notify Employee when leave is rejected
        try:
            Notification.objects.create(
                recipient=leave.employee,
                title="Leave Request Rejected",
                message=f"Your {leave.leave_type} leave request from {leave.start_date} to {leave.end_date} has been rejected.",
                target="EMPLOYEE",
                link_tab="leaves",
                created_by=request.user
            )
        except Exception:
            pass

        return Response({'status': 'Leave request rejected.', 'data': LeaveRequestSerializer(leave).data})
