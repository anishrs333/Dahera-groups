from django.test import TestCase
from django.contrib.auth import get_user_model
from datetime import time
from attendance.models import Attendance

User = get_user_model()

class UserTerminationAndPasswordTestCase(TestCase):
    def setUp(self):
        self.male_user = User.objects.create_user(
            username='male_test@thahira.com',
            email='male_test@thahira.com',
            password='9876543210',
            gender=User.Gender.MALE,
            role=User.Role.EMPLOYEE,
            phone='9876543210',
            employee_id='THG-M-99'
        )

    def test_scheduled_login_times(self):
        self.assertEqual(self.male_user.get_scheduled_login_time(), "10:00 AM")
        self.assertEqual(self.male_user.get_scheduled_login_time_obj(), time(10, 0, 0))

    def test_termination_status(self):
        self.assertTrue(self.male_user.is_active)
        self.assertEqual(self.male_user.status, User.Status.ACTIVE)
        
        # Terminate employee
        self.male_user.is_active = False
        self.male_user.status = User.Status.TERMINATED
        self.male_user.save()

        self.assertFalse(self.male_user.is_active)
        self.assertEqual(self.male_user.status, User.Status.TERMINATED)

    def test_password_change(self):
        self.assertTrue(self.male_user.check_password('9876543210'))
        self.male_user.set_password('NewSecurePass@2026')
        self.male_user.save()
        self.assertTrue(self.male_user.check_password('NewSecurePass@2026'))
