from django.db import models
from django.conf import settings
from decimal import Decimal

class SalarySlip(models.Model):
    class Status(models.TextChoices):
        GENERATED = 'GENERATED', 'Generated'
        ISSUED = 'ISSUED', 'Issued'
        PAID = 'PAID', 'Paid'

    MONTH_CHOICES = [
        (1, 'January'), (2, 'February'), (3, 'March'), (4, 'April'),
        (5, 'May'), (6, 'June'), (7, 'July'), (8, 'August'),
        (9, 'September'), (10, 'October'), (11, 'November'), (12, 'December')
    ]

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='salary_slips'
    )
    month = models.IntegerField(choices=MONTH_CHOICES)
    year = models.IntegerField(default=2026)
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2)
    allowances = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    net_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ISSUED
    )
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-year', '-month']
        unique_together = ('employee', 'month', 'year')

    def save(self, *args, **kwargs):
        # Auto-compute net salary: basic + allowances - deductions
        self.net_salary = Decimal(str(self.basic_salary)) + Decimal(str(self.allowances)) - Decimal(str(self.deductions))
        super().save(*args, **kwargs)

    def get_month_name(self) -> str:
        return dict(self.MONTH_CHOICES).get(self.month, str(self.month))

    def __str__(self):
        return f"{self.employee.get_full_name()} - {self.get_month_name()} {self.year} (₹{self.net_salary})"
