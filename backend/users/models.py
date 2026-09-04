from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import time

class User(AbstractUser):
    class Gender(models.TextChoices):
        MALE = 'MALE', 'Male'
        FEMALE = 'FEMALE', 'Female'

    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        EMPLOYEE = 'EMPLOYEE', 'Employee'

    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        TERMINATED = 'TERMINATED', 'Terminated'
        ON_LEAVE = 'ON_LEAVE', 'On Leave'

    gender = models.CharField(max_length=10, choices=Gender.choices, default=Gender.MALE)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.EMPLOYEE)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    employee_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    designation = models.CharField(max_length=100, default='Software Engineer', blank=True)
    department = models.CharField(max_length=100, default='Engineering', blank=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    date_of_joining = models.DateField(null=True, blank=True)
    bio = models.TextField(blank=True, default="Dedicated team member at Thahira Groups.")
    base_salary = models.DecimalField(max_digits=12, decimal_places=2, default=50000.00)

    def get_scheduled_login_time(self) -> str:
        if self.gender == self.Gender.FEMALE:
            return "09:30 AM"
        return "10:00 AM"

    def get_scheduled_login_time_obj(self) -> time:
        if self.gender == self.Gender.FEMALE:
            return time(9, 30, 0)
        return time(10, 0, 0)

    @property
    def is_admin_role(self) -> bool:
        return self.role == self.Role.ADMIN or self.is_superuser

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.employee_id or 'No ID'}) - {self.role}"
