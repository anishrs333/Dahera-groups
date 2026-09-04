from rest_framework import serializers
from .models import SalarySlip
from users.serializers import UserSerializer

class SalarySlipSerializer(serializers.ModelSerializer):
    employee_details = UserSerializer(source='employee', read_only=True)
    month_name = serializers.CharField(source='get_month_name', read_only=True)
    scheduled_login_time = serializers.SerializerMethodField()

    class Meta:
        model = SalarySlip
        fields = [
            'id', 'employee', 'employee_details', 'month', 'month_name',
            'year', 'basic_salary', 'allowances', 'deductions', 'net_salary',
            'status', 'generated_at', 'scheduled_login_time'
        ]
        read_only_fields = ['id', 'net_salary', 'generated_at', 'scheduled_login_time', 'month_name']

    def get_scheduled_login_time(self, obj) -> str:
        return obj.employee.get_scheduled_login_time()
