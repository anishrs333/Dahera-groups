# Thahira Groups Enterprise ERP System

Full-stack Enterprise Resource Planning (ERP) platform built with Django REST Framework and React (Vite, Tailwind CSS, Lucide Icons).

## Key Features

- **Authentication & RBAC**: JWT Authentication (`SimpleJWT`), role-based access control (Admin & Employee roles), direct profile password change.
- **Gender-Based Shift Scheduling**: 
  - Male Staff: 10:00 AM Login Shift.
  - Female Staff: 09:30 AM Login Shift.
- **Ordered Sequential Employee IDs**: Automatically generated sequential IDs (`THG-M-01`, `THG-M-02`... for Male; `THG-F-01`, `THG-F-02`... for Female). Initial portal password is set to employee registered mobile number.
- **Attendance & Shift Check-In**: Real-time shift clock-in/clock-out console with automatic late arrival flags and shift log tracking.
- **Leave Management Portal**: Staff leave submission portal with administrative approval queue and status notifications.
- **Month Calendar Salary Slips & PDF Download**: Automatic per-day salary rate calculation based on calendar days (30/31 days), leave absence deductions, and ReportLab PDF payslip generation with 1-click download.
- **Account Termination Blocking**: Admin 1-click employee termination blocking access instantly upon termination.
- **Modern Responsive Interface**: Floating Magnetic Navigation Dock header, bottom navigation bar, mobile drawer menu, and dark/light mode toggle.

## System Architecture

```text
Dahera_grps/
├── backend/
│   ├── dahera_backend/    # Django project settings & URLs
│   ├── users/             # User model, authentication, RBAC, termination
│   ├── attendance/        # Shift check-in/out logic & logs
│   ├── leaves/            # Leave application & approval workflow
│   ├── payroll/           # Salary slip generator & ReportLab PDF engine
│   └── manage.py
└── frontend/
    ├── src/
    │   ├── components/    # Navbar, BottomDock, Sidebar, Login, Dashboards
    │   ├── context/       # Auth context
    │   ├── services/      # Axios API client
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Getting Started

### 1. Backend Setup (Django)

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver 8000
```

### 2. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

## Admin Credentials

- **Username**: `thahira_admin`
- **Password**: `admin@123`
- **Employee ID**: `THG-ADM-01`
