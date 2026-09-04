from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Dahera Organization Info', {
            'fields': ('gender', 'role', 'employee_id', 'designation', 'department', 'phone', 'date_of_joining', 'bio', 'base_salary')
        }),
    )
    list_display = ('username', 'email', 'full_name_display', 'gender', 'role', 'employee_id', 'designation', 'is_staff')
    list_filter = ('role', 'gender', 'department', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'employee_id', 'designation')

    def full_name_display(self, obj):
        return obj.get_full_name() or obj.username
    full_name_display.short_description = 'Full Name'
