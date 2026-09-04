from rest_framework.permissions import BasePermission

class IsAdminUserRole(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin_role)

class IsEmployeeUserRole(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'EMPLOYEE')

class IsSelfOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_admin_role:
            return True
        
        if hasattr(obj, 'employee'):
            return obj.employee == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user
