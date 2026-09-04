from django.db import models
from django.conf import settings
from django.utils import timezone

class LeaveRequest(models.Model):
    class LeaveType(models.TextChoices):
        CASUAL = 'CASUAL', 'Casual Leave'
        SICK = 'SICK', 'Sick Leave'
        PAID = 'PAID', 'Paid Leave'
        UNPAID = 'UNPAID', 'Unpaid Leave'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='leave_requests'
    )
    leave_type = models.CharField(
        max_length=20,
        choices=LeaveType.choices,
        default=LeaveType.CASUAL
    )
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    admin_notes = models.TextField(blank=True, null=True)
    applied_on = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_on']

    @property
    def total_days(self) -> int:
        if self.start_date and self.end_date:
            delta = (self.end_date - self.start_date).days + 1
            return max(delta, 1)
        return 1

    def __str__(self):
        return f"{self.employee.get_full_name()} - {self.leave_type} ({self.status})"
