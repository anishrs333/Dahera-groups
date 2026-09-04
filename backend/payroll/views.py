from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from .models import SalarySlip
from .serializers import SalarySlipSerializer
from .utils import generate_salary_slip_pdf
from users.permissions import IsAdminUserRole, IsSelfOrAdmin
from leaves.models import LeaveRequest

class SalarySlipViewSet(viewsets.ModelViewSet):
    serializer_class = SalarySlipSerializer
    permission_classes = [IsAuthenticated, IsSelfOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin_role:
            return SalarySlip.objects.all().select_related('employee').order_by('-year', '-month')
        return SalarySlip.objects.filter(employee=user).order_by('-year', '-month')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUserRole()]
        return super().get_permissions()

    def perform_create(self, serializer):
        # Auto-compute approved leave days deducted in that month if not specified
        emp = serializer.validated_data.get('employee')
        month = serializer.validated_data.get('month')
        year = serializer.validated_data.get('year')
        
        leave_deducted = serializer.validated_data.get('leave_days_deducted')
        if leave_deducted is None or leave_deducted == 0:
            # Query approved leave requests in month & year
            approved_leaves = LeaveRequest.objects.filter(
                employee=emp,
                status='APPROVED',
                start_date__year=year,
                start_date__month=month
            )
            total_leave_days = sum(l.total_days for l in approved_leaves)
            serializer.save(leave_days_deducted=total_leave_days)
        else:
            serializer.save()

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated, IsSelfOrAdmin])
    def download_pdf(self, request, pk=None):
        salary_slip = self.get_object()
        pdf_bytes = generate_salary_slip_pdf(salary_slip)
        filename = f"Thahira_Salary_Slip_{salary_slip.employee.employee_id or salary_slip.employee.id}_{salary_slip.get_month_name()}_{salary_slip.year}.pdf"

        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        response['Access-Control-Expose-Headers'] = 'Content-Disposition'
        return response
