from django.contrib import admin
from .models import SalarySlip

@admin.register(SalarySlip)
class SalarySlipAdmin(admin.ModelAdmin):
    list_display = ('employee', 'month', 'year', 'basic_salary', 'allowances', 'deductions', 'net_salary', 'status')
    list_filter = ('status', 'year', 'month')
    search_fields = ('employee__username', 'employee__first_name', 'employee__last_name', 'employee__employee_id')
