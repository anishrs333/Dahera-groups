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
            'gender', 'role', 'status', 'employee_id', 'designation', 'department',
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
            'gender', 'role', 'status', 'employee_id', 'designation', 'department',
            'phone', 'date_of_joining', 'bio', 'base_salary'
        ]

    def create(self, validated_data):
        provided_password = validated_data.pop('password', None)
        phone_number = validated_data.get('phone', '').strip()
        gender = validated_data.get('gender', 'MALE')

        # Sequential Employee ID Generation in Order (THG-M-01, THG-M-02... / THG-F-01, THG-F-02...)
        gender_prefix = 'THG-F-' if gender == 'FEMALE' else 'THG-M-'
        existing_count = User.objects.filter(gender=gender).exclude(role='ADMIN').count() + 1
        num_str = f"{existing_count:02d}"
        validated_data['employee_id'] = f"{gender_prefix}{num_str}"

        # Initial Password = Employee Mobile Number
        initial_password = provided_password or phone_number or '9876543210'

        user = User.objects.create(**validated_data)
        user.set_password(initial_password)
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

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    JWT Serializer for Thahira Groups:
    Authenticates via Email, Username, or Employee ID (THG-M-01 / THG-F-01).
    Denies login if account is TERMINATED or INACTIVE.
    """
    def validate(self, attrs):
        login_input = attrs.get('username', '').strip()
        if login_input:
            user_obj = User.objects.filter(
                Q(employee_id__iexact=login_input) | 
                Q(email__iexact=login_input) | 
                Q(username__iexact=login_input)
            ).first()
            
            if user_obj:
                if not user_obj.is_active or user_obj.status == 'TERMINATED':
                    raise serializers.ValidationError({
                        'detail': 'Access Denied. Your employment account with Thahira Groups has been terminated.'
                    })
                attrs['username'] = user_obj.username

        data = super().validate(attrs)
        
        if not self.user.is_active or self.user.status == 'TERMINATED':
            raise serializers.ValidationError({
                'detail': 'Access Denied. Your employment account with Thahira Groups has been terminated.'
            })

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
        token['status'] = user.status
        return token
