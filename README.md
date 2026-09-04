# Thahira Groups - Enterprise Management & ERP Portal

An enterprise-grade HR & Employee Management System built with **Django REST Framework (DRF)**, **SQLite**, and **React (Vite + Tailwind CSS)**.

## Key Features

- **Security & Authentication**:
  - Role-Based Access Control (RBAC): Admin vs Employee.
  - JWT Token Authentication (`djangorestframework-simplejwt`).
  - Object-level permission security (Employees access only their own data).
  - Production-ready security headers, rate limiting, and CORS configuration.

- **Gender-Based Login Schedule Rules**:
  - **Male Employee Shift Schedule**: **10:00 AM** (IDs: `THG-M-01`, `THG-M-02`...)
  - **Female Employee Shift Schedule**: **09:30 AM** (IDs: `THG-F-01`, `THG-F-02`...)
  - Dynamic UI badges and backend automated late/on-time attendance tracking based on gender rules.

- **Initial Password Rule**:
  - Initial Password for any newly created Employee (Male or Female) = **Mobile Number**.

- **Admin Portal**:
  - Real-time metrics (Employee counts, gender split, today's attendance, pending leaves).
  - Employee Directory (Add, view, update employee bio, gender, department, salary).
  - Leave Request Approval/Rejection Queue with administrative notes.
  - Monthly Salary Slip Generation & Payroll Overview.

- **Employee Portal (Desktop & Mobile)**:
  - Personal Bio & Scheduled Login Time Display.
  - Real-time Daily Attendance Check-In / Check-Out.
  - Leave Application submission & status tracking.
  - Downloadable PDF Salary Slips formatted for both mobile and desktop viewports.

## UI Theme

- **Background**: Light Warm Gray (`#FAF9F6`)
- **Primary Accent**: Rich Dark Crimson Red (`#881337`)

## Quick Start Guide

### 1. Backend Setup
```bash
cd backend
backend\venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data  # Creates default Admin thahira_admin
python manage.py runserver 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Demo Credentials
- **Admin**: `thahira_admin` / `admin@123`
