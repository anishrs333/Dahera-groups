from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from .models import SalarySlip
from .serializers import SalarySlipSerializer
from .utils import generate_salary_slip_pdf
from users.permissions import IsAdminUserRole, IsSelfOrAdmin

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

    @action(detail=True, methods=['get'])
    def download_pdf(self, request, pk=None):
        salary_slip = self.get_object()
        pdf_bytes = generate_salary_slip_pdf(salary_slip)
        filename = f"Dahera_Salary_Slip_{salary_slip.employee.employee_id or salary_slip.employee.id}_{salary_slip.get_month_name()}_{salary_slip.year}.pdf"

        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
