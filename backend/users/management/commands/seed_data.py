from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import date, timedelta
from attendance.models import Attendance
from leaves.models import LeaveRequest
from payroll.models import SalarySlip

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds Dahera Groups ERP data with DHG-M-01..03 and DHG-F-01..03 employee IDs.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding Dahera Groups ERP data with updated DHG Employee IDs..."))

        # Clear existing non-superuser data cleanly for fresh re-seed
        Attendance.objects.all().delete()
        LeaveRequest.objects.all().delete()
        SalarySlip.objects.all().delete()

        # 1. Admin User
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
                'bio': 'System Administrator for Dahera Groups.',
                'base_salary': 150000.00,
                'is_staff': True,
                'is_superuser': True
            }
        )
        if not created:
            admin_user.employee_id = 'DHG-ADM-01'
            admin_user.save()

        # 2. Male Employees (DHG-M-01, DHG-M-02, DHG-M-03) -> Shift: 10:00 AM
        male_data = [
            ('john.male@dahera.com', 'John', 'Doe', 'DHG-M-01', 'Senior Software Engineer', 'Engineering', 85000.00),
            ('alex.male@dahera.com', 'Alex', 'Mercer', 'DHG-M-02', 'DevOps Specialist', 'Infrastructure', 82000.00),
            ('robert.male@dahera.com', 'Robert', 'Vance', 'DHG-M-03', 'Product Manager', 'Product Team', 95000.00),
        ]

        male_users = []
        for email, fn, ln, emp_id, desig, dept, sal in male_data:
            u, _ = User.objects.get_or_create(
                username=email,
                defaults={
                    'email': email,
                    'first_name': fn,
                    'last_name': ln,
                    'gender': User.Gender.MALE,
                    'role': User.Role.EMPLOYEE,
                    'employee_id': emp_id,
                    'designation': desig,
                    'department': dept,
                    'phone': '+91 98765 43210',
                    'date_of_joining': date(2023, 1, 15),
                    'bio': f'{desig} at Dahera Groups.',
                    'base_salary': sal
                }
            )
            u.employee_id = emp_id
            u.set_password('Employee@123')
            u.save()
            male_users.append(u)

        # 3. Female Employees (DHG-F-01, DHG-F-02, DHG-F-03) -> Shift: 9:30 AM
        female_data = [
            ('sarah.female@dahera.com', 'Sarah', 'Connor', 'DHG-F-01', 'Lead UI/UX Designer', 'Design & Frontend', 90000.00),
            ('emma.female@dahera.com', 'Emma', 'Watson', 'DHG-F-02', 'QA Automation Engineer', 'Quality Assurance', 78000.00),
            ('maya.female@dahera.com', 'Maya', 'Lin', 'DHG-F-03', 'HR Generalist', 'Human Resources', 80000.00),
        ]

        female_users = []
        for email, fn, ln, emp_id, desig, dept, sal in female_data:
            u, _ = User.objects.get_or_create(
                username=email,
                defaults={
                    'email': email,
                    'first_name': fn,
                    'last_name': ln,
                    'gender': User.Gender.FEMALE,
                    'role': User.Role.EMPLOYEE,
                    'employee_id': emp_id,
                    'designation': desig,
                    'department': dept,
                    'phone': '+91 98765 88990',
                    'date_of_joining': date(2023, 3, 20),
                    'bio': f'{desig} at Dahera Groups.',
                    'base_salary': sal
                }
            )
            u.employee_id = emp_id
            u.set_password('Employee@123')
            u.save()
            female_users.append(u)

        # Seed Sample Leaves
        LeaveRequest.objects.create(
            employee=male_users[0], # DHG-M-01
            leave_type=LeaveRequest.LeaveType.PAID,
            start_date=date.today() + timedelta(days=5),
            end_date=date.today() + timedelta(days=7),
            reason='Annual leave request.',
            status=LeaveRequest.Status.PENDING
        )

        LeaveRequest.objects.create(
            employee=female_users[0], # DHG-F-01
            leave_type=LeaveRequest.LeaveType.SICK,
            start_date=date.today() - timedelta(days=5),
            end_date=date.today() - timedelta(days=4),
            reason='Rest and recovery.',
            status=LeaveRequest.Status.APPROVED,
            admin_notes='Approved by HR manager.'
        )

        # Seed Sample Salary Slips
        SalarySlip.objects.create(
            employee=male_users[0],
            month=8,
            year=2026,
            basic_salary=50000.00,
            allowances=35000.00,
            deductions=5000.00,
            status=SalarySlip.Status.ISSUED
        )

        SalarySlip.objects.create(
            employee=female_users[0],
            month=8,
            year=2026,
            basic_salary=55000.00,
            allowances=35000.00,
            deductions=6000.00,
            status=SalarySlip.Status.ISSUED
        )

        self.stdout.write(self.style.SUCCESS("Database seeded with updated DHG-M-01..03 and DHG-F-01..03 Employee IDs!"))
