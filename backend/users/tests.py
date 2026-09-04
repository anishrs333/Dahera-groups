from django.test import TestCase
from django.contrib.auth import get_user_model
from datetime import time
from attendance.models import Attendance

User = get_user_model()

class UserGenderScheduleTestCase(TestCase):
    def setUp(self):
        self.male_user = User.objects.create_user(
            username='male_test@dahera.com',
            email='male_test@dahera.com',
            password='Password@123',
            gender=User.Gender.MALE,
            role=User.Role.EMPLOYEE,
            employee_id='TEST-M01'
        )

        self.female_user = User.objects.create_user(
            username='female_test@dahera.com',
            email='female_test@dahera.com',
            password='Password@123',
            gender=User.Gender.FEMALE,
            role=User.Role.EMPLOYEE,
            employee_id='TEST-F01'
        )

    def test_scheduled_login_times(self):
        """
        Verify gender-specific scheduled login time requirements:
        - Male -> 10:00 AM
        - Female -> 9:30 AM
        """
        self.assertEqual(self.male_user.get_scheduled_login_time(), "10:00 AM")
        self.assertEqual(self.female_user.get_scheduled_login_time(), "09:30 AM")
        self.assertEqual(self.male_user.get_scheduled_login_time_obj(), time(10, 0, 0))
        self.assertEqual(self.female_user.get_scheduled_login_time_obj(), time(9, 30, 0))

    def test_attendance_defaults(self):
        attendance_m = Attendance.objects.create(employee=self.male_user)
        attendance_f = Attendance.objects.create(employee=self.female_user)

        self.assertEqual(attendance_m.expected_login_time, "10:00 AM")
        self.assertEqual(attendance_f.expected_login_time, "09:30 AM")
