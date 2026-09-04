from rest_framework import serializers
from .models import Attendance
from users.serializers import UserSerializer

class AttendanceSerializer(serializers.ModelSerializer):
    employee_details = UserSerializer(source='employee', read_only=True)

    class Meta:
        model = Attendance
        fields = [
            'id', 'employee', 'employee_details', 'date', 'check_in', 'check_out',
            'status', 'expected_login_time', 'working_hours', 'notes'
        ]
        read_only_fields = ['id', 'employee', 'expected_login_time', 'working_hours']
