from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import datetime, time

class Attendance(models.Model):
    class Status(models.TextChoices):
        ON_TIME = 'ON_TIME', 'On Time'
        LATE = 'LATE', 'Late'
        ABSENT = 'ABSENT', 'Absent'
        COMPLETED = 'COMPLETED', 'Completed'

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    date = models.DateField(default=timezone.now)
    check_in = models.DateTimeField(null=True, blank=True)
    check_out = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ON_TIME
    )
    expected_login_time = models.CharField(
        max_length=20,
        blank=True,
        help_text="Expected login time based on gender schedule (10:00 AM Male / 09:30 AM Female)"
    )
    working_hours = models.FloatField(default=0.0)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-date', '-check_in']
        unique_together = ('employee', 'date')

    def save(self, *args, **kwargs):
        if not self.expected_login_time and self.employee:
            self.expected_login_time = self.employee.get_scheduled_login_time()

        # Calculate working hours if check_out exists
        if self.check_in and self.check_out:
            delta = self.check_out - self.check_in
            self.working_hours = round(delta.total_seconds() / 3600.0, 2)
            if self.status != self.Status.LATE:
                self.status = self.Status.COMPLETED

        super().save(*args, **kwargs)

    def evaluate_late_status(self):
        """
        Determines whether check_in is late based on employee gender schedule:
        - Male: 10:00 AM
        - Female: 09:30 AM
        """
        if not self.check_in or not self.employee:
            return
        
        # Local time of check_in
        check_in_time = self.check_in.time()
        scheduled_time = self.employee.get_scheduled_login_time_obj()

        # Grace period 5 minutes
        cutoff_seconds = (scheduled_time.hour * 3600) + (scheduled_time.minute * 60) + 300
        actual_seconds = (check_in_time.hour * 3600) + (check_in_time.minute * 60) + check_in_time.second

        if actual_seconds > cutoff_seconds:
            self.status = self.Status.LATE
        else:
            self.status = self.Status.ON_TIME

    def __str__(self):
        return f"{self.employee.get_full_name()} - {self.date} ({self.status})"
