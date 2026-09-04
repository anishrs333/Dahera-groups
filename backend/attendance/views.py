from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Attendance
from .serializers import AttendanceSerializer
from users.permissions import IsSelfOrAdmin

class CheckInView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        today = timezone.now().date()
        attendance, created = Attendance.objects.get_or_create(
            employee=request.user,
            date=today,
            defaults={
                'expected_login_time': request.user.get_scheduled_login_time()
            }
        )

        if attendance.check_in and not created:
            return Response(
                {'detail': 'You have already checked in for today.', 'data': AttendanceSerializer(attendance).data},
                status=status.HTTP_400_BAD_REQUEST
            )

        attendance.check_in = timezone.now()
        attendance.expected_login_time = request.user.get_scheduled_login_time()
        attendance.evaluate_late_status()
        attendance.save()

        return Response(
            {'message': 'Check-in successful!', 'data': AttendanceSerializer(attendance).data},
            status=status.HTTP_200_OK
        )

class CheckOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        today = timezone.now().date()
        try:
            attendance = Attendance.objects.get(employee=request.user, date=today)
        except Attendance.DoesNotExist:
            return Response(
                {'detail': 'No check-in record found for today. Please check in first.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not attendance.check_in:
            return Response(
                {'detail': 'You must check in before checking out.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if attendance.check_out:
            return Response(
                {'detail': 'You have already checked out for today.', 'data': AttendanceSerializer(attendance).data},
                status=status.HTTP_400_BAD_REQUEST
            )

        attendance.check_out = timezone.now()
        attendance.save()

        return Response(
            {'message': 'Check-out successful!', 'data': AttendanceSerializer(attendance).data},
            status=status.HTTP_200_OK
        )

class TodayAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        attendance = Attendance.objects.filter(employee=request.user, date=today).first()
        if not attendance:
            return Response({'attendance': None, 'scheduled_login_time': request.user.get_scheduled_login_time()})
        return Response({'attendance': AttendanceSerializer(attendance).data, 'scheduled_login_time': request.user.get_scheduled_login_time()})

class AttendanceViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated, IsSelfOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin_role:
            return Attendance.objects.all().select_related('employee').order_by('-date')
        return Attendance.objects.filter(employee=user).order_by('-date')
