from django.contrib import admin
from .models import LeaveRequest

@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ('employee', 'leave_type', 'start_date', 'end_date', 'total_days', 'status', 'applied_on')
    list_filter = ('status', 'leave_type', 'applied_on')
    search_fields = ('employee__username', 'employee__first_name', 'employee__last_name', 'reason')
