from django.db import models
from django.contrib.auth import get_user_model
from decimal import Decimal
import calendar

User = get_user_model()

class SalarySlip(models.Model):
    MONTH_CHOICES = [
        (1, 'January'), (2, 'February'), (3, 'March'), (4, 'April'),
        (5, 'May'), (6, 'June'), (7, 'July'), (8, 'August'),
        (9, 'September'), (10, 'October'), (11, 'November'), (12, 'December')
    ]

    STATUS_CHOICES = [
        ('PAID', 'Paid'),
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing')
    ]

    employee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='salary_slips'
    )
    month = models.IntegerField(choices=MONTH_CHOICES)
    year = models.IntegerField(default=2026)
    
    days_in_month = models.IntegerField(default=30)
    leave_days_deducted = models.DecimalField(max_digits=5, decimal_places=1, default=0.0)
    daily_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    leave_deduction_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PAID')
    generated_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year', '-month']
        unique_together = ['employee', 'month', 'year']

    def calculate_salary_details(self):
        try:
            self.days_in_month = calendar.monthrange(int(self.year), int(self.month))[1]
        except Exception:
            self.days_in_month = 30

        if self.days_in_month > 0 and self.basic_salary:
            self.daily_rate = round(Decimal(str(self.basic_salary)) / Decimal(str(self.days_in_month)), 2)
        else:
            self.daily_rate = Decimal('0.00')

        self.leave_deduction_amount = round(Decimal(str(self.leave_days_deducted or 0)) * self.daily_rate, 2)
        
        gross_basic = Decimal(str(self.basic_salary or 0)) - self.leave_deduction_amount
        if gross_basic < Decimal('0.00'):
            gross_basic = Decimal('0.00')

        self.net_salary = round(gross_basic + Decimal(str(self.allowances or 0)) - Decimal(str(self.deductions or 0)), 2)

    def save(self, *args, **kwargs):
        self.calculate_salary_details()
        super().save(*args, **kwargs)

    def get_month_name(self) -> str:
        return dict(self.MONTH_CHOICES).get(self.month, '')

    def __str__(self):
        return f"Payslip {self.get_month_name()} {self.year} - {self.employee.get_full_name()} ({self.employee.employee_id})"
