from rest_framework.permissions import BasePermission

class IsAdminUserRole(BasePermission):
    """
    Custom permission allowing access only to users with ADMIN role or superusers.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin_role)

class IsEmployeeUserRole(BasePermission):
    """
    Custom permission allowing access to users with EMPLOYEE role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'EMPLOYEE')

class IsSelfOrAdmin(BasePermission):
    """
    Object-level permission allowing access to the object owner or admins.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_admin_role:
            return True
        
        # Check ownership across different model attributes
        if hasattr(obj, 'employee'):
            return obj.employee == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user
