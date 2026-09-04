from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    scheduled_login_time = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'gender', 'role', 'employee_id', 'designation', 'department',
            'phone', 'date_of_joining', 'bio', 'base_salary', 'scheduled_login_time',
            'is_active'
        ]
        read_only_fields = ['id', 'scheduled_login_time', 'full_name']

    def get_scheduled_login_time(self, obj) -> str:
        return obj.get_scheduled_login_time()

    def get_full_name(self, obj) -> str:
        return obj.get_full_name() or obj.username

class UserCreateUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'password',
            'gender', 'role', 'employee_id', 'designation', 'department',
            'phone', 'date_of_joining', 'bio', 'base_salary'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password', 'Employee@123')
        # Auto-generate employee_id if missing
        if not validated_data.get('employee_id'):
            count = User.objects.count() + 101
            validated_data['employee_id'] = f"DEG-{count}"

        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Beginner-Friendly JWT Login Serializer:
    Allows authenticating using Email, Username, OR Employee ID!
    """
    def validate(self, attrs):
        login_input = attrs.get('username', '').strip()
        if login_input:
            # Check if input matches an employee_id or email
            user_obj = User.objects.filter(
                Q(employee_id__iexact=login_input) | 
                Q(email__iexact=login_input) | 
                Q(username__iexact=login_input)
            ).first()
            
            if user_obj:
                attrs['username'] = user_obj.username

        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['gender'] = user.gender
        token['scheduled_login_time'] = user.get_scheduled_login_time()
        token['name'] = user.get_full_name() or user.username
        token['employee_id'] = user.employee_id or ""
        return token
