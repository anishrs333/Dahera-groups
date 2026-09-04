from rest_framework import serializers
from .models import LeaveRequest
from users.serializers import UserSerializer

class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_details = UserSerializer(source='employee', read_only=True)
    total_days = serializers.ReadOnlyField()

    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'employee', 'employee_details', 'leave_type', 'start_date',
            'end_date', 'total_days', 'reason', 'status', 'admin_notes',
            'applied_on', 'updated_at'
        ]
        read_only_fields = ['id', 'employee', 'applied_on', 'updated_at', 'total_days']

    def validate(self, attrs):
        start = attrs.get('start_date')
        end = attrs.get('end_date')
        if start and end and end < start:
            raise serializers.ValidationError({"end_date": "End date cannot be earlier than start date."})
        return attrs
