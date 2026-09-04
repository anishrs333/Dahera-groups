from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import date, timedelta
from attendance.models import Attendance
from leaves.models import LeaveRequest
from payroll.models import SalarySlip

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds initial administrative and employee sample data for Dahera Groups ERP.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding Dahera Groups ERP data..."))

        # 1. Admin User
        admin_user, created = User.objects.get_or_create(
            username='admin@dahera.com',
            defaults={
                'email': 'admin@dahera.com',
                'first_name': 'Dahera',
                'last_name': 'Administrator',
                'gender': User.Gender.MALE,
                'role': User.Role.ADMIN,
                'employee_id': 'DEG-ADM-001',
                'designation': 'Chief Executive Officer',
                'department': 'Executive Management',
                'bio': 'System Administrator & Executive Director for Dahera Groups.',
                'base_salary': 150000.00,
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin_user.set_password('Admin@123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("Created Admin user: admin@dahera.com / Admin@123"))

        # 2. Male Employee (Login Schedule: 10:00 AM)
        john_user, created = User.objects.get_or_create(
            username='john.male@dahera.com',
            defaults={
                'email': 'john.male@dahera.com',
                'first_name': 'John',
                'last_name': 'Doe',
                'gender': User.Gender.MALE,
                'role': User.Role.EMPLOYEE,
                'employee_id': 'DEG-M101',
                'designation': 'Senior Software Engineer',
                'department': 'Engineering',
                'phone': '+91 98765 43210',
                'date_of_joining': date(2023, 1, 15),
                'bio': 'Senior Full Stack Developer specializing in Python, Django REST, and React application architectures.',
                'base_salary': 85000.00
            }
        )
        if created:
            john_user.set_password('Employee@123')
            john_user.save()
            self.stdout.write(self.style.SUCCESS("Created Male Employee user: john.male@dahera.com / Employee@123 (Shift: 10:00 AM)"))

        # 3. Female Employee (Login Schedule: 09:30 AM)
        sarah_user, created = User.objects.get_or_create(
            username='sarah.female@dahera.com',
            defaults={
                'email': 'sarah.female@dahera.com',
                'first_name': 'Sarah',
                'last_name': 'Connor',
                'gender': User.Gender.FEMALE,
                'role': User.Role.EMPLOYEE,
                'employee_id': 'DEG-F102',
                'designation': 'Lead UI/UX Engineer',
                'department': 'Design & Frontend',
                'phone': '+91 98765 88990',
                'date_of_joining': date(2023, 3, 20),
                'bio': 'Lead UI/UX Engineer focused on human-centric accessibility, mobile responsiveness, and design systems.',
                'base_salary': 90000.00
            }
        )
        if created:
            sarah_user.set_password('Employee@123')
            sarah_user.save()
            self.stdout.write(self.style.SUCCESS("Created Female Employee user: sarah.female@dahera.com / Employee@123 (Shift: 9:30 AM)"))

        # Seed Sample Leaves
        LeaveRequest.objects.get_or_create(
            employee=john_user,
            start_date=date.today() + timedelta(days=5),
            end_date=date.today() + timedelta(days=7),
            defaults={
                'leave_type': LeaveRequest.LeaveType.PAID,
                'reason': 'Annual family vacation leave request.',
                'status': LeaveRequest.Status.PENDING
            }
        )

        LeaveRequest.objects.get_or_create(
            employee=sarah_user,
            start_date=date.today() - timedelta(days=10),
            end_date=date.today() - timedelta(days=9),
            defaults={
                'leave_type': LeaveRequest.LeaveType.SICK,
                'reason': 'Fever and medical rest.',
                'status': LeaveRequest.Status.APPROVED,
                'admin_notes': 'Approved by HR manager.'
            }
        )

        # Seed Sample Salary Slips
        SalarySlip.objects.get_or_create(
            employee=john_user,
            month=8,
            year=2026,
            defaults={
                'basic_salary': 50000.00,
                'allowances': 35000.00,
                'deductions': 5000.00,
                'status': SalarySlip.Status.ISSUED
            }
        )

        SalarySlip.objects.get_or_create(
            employee=sarah_user,
            month=8,
            year=2026,
            defaults={
                'basic_salary': 55000.00,
                'allowances': 35000.00,
                'deductions': 6000.00,
                'status': SalarySlip.Status.ISSUED
            }
        )

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
