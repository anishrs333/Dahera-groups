from django.contrib import admin
from .models import Attendance

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('employee', 'date', 'check_in', 'check_out', 'status', 'expected_login_time', 'working_hours')
    list_filter = ('status', 'date', 'expected_login_time')
    search_fields = ('employee__username', 'employee__first_name', 'employee__last_name', 'employee__employee_id')
