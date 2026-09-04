from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from attendance.models import Attendance
from leaves.models import LeaveRequest
from payroll.models import SalarySlip

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds initial Admin account for Dahera Groups ERP without dummy employees.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Setting up Dahera Groups ERP System..."))

        # Clean database records
        Attendance.objects.all().delete()
        LeaveRequest.objects.all().delete()
        SalarySlip.objects.all().delete()

        # Admin User
        admin_user, created = User.objects.get_or_create(
            username='admin@dahera.com',
            defaults={
                'email': 'admin@dahera.com',
                'first_name': 'Dahera',
                'last_name': 'Admin',
                'gender': User.Gender.MALE,
                'role': User.Role.ADMIN,
                'employee_id': 'DHG-ADM-01',
                'designation': 'Executive Director',
                'department': 'Executive Board',
                'phone': '9876543210',
                'bio': 'System Administrator for Dahera Groups.',
                'base_salary': 150000.00,
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created or not admin_user.check_password('Admin@123'):
            admin_user.set_password('Admin@123')
            admin_user.employee_id = 'DHG-ADM-01'
            admin_user.save()

        # Remove previous dummy non-admin employees if any
        User.objects.filter(role='EMPLOYEE').delete()

        self.stdout.write(self.style.SUCCESS("Clean setup complete! Admin account ready: admin@dahera.com / Admin@123"))
