from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CheckInView, CheckOutView, TodayAttendanceView, AttendanceViewSet

router = DefaultRouter()
router.register(r'logs', AttendanceViewSet, basename='attendance-logs')

urlpatterns = [
    path('check-in/', CheckInView.as_view(), name='check_in'),
    path('check-out/', CheckOutView.as_view(), name='check_out'),
    path('today/', TodayAttendanceView.as_view(), name='today_attendance'),
    path('', include(router.urls)),
]
