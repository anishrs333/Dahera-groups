# Dahera Groups - Enterprise Management & ERP Portal

An enterprise-grade HR & Employee Management System built with **Django REST Framework (DRF)**, **SQLite**, and **React (Vite + Tailwind CSS)**.

## Key Features

- **Security & Authentication**:
  - Role-Based Access Control (RBAC): Admin vs Employee.
  - JWT Token Authentication (`djangorestframework-simplejwt`).
  - Object-level permission security (Employees access only their own data).
  - Production-ready security headers, rate limiting, and CORS configuration.

- **Gender-Based Login Schedule Rules**:
  - **Male Employee Shift Schedule**: **10:00 AM**
  - **Female Employee Shift Schedule**: **09:30 AM**
  - Dynamic UI badges and backend automated late/on-time attendance tracking based on gender rules.

- **Admin Portal**:
  - Real-time metrics (Employee counts, gender split, today's attendance, pending leaves).
  - Employee Management (Add, view, update employee bio, gender, department, salary).
  - Leave Request Approval/Rejection Queue with administrative notes.
  - Monthly Salary Slip Generation & Payroll Overview.

- **Employee Portal (Desktop & Mobile)**:
  - Personal Bio & Scheduled Login Time Display.
  - Real-time Daily Attendance Check-In / Check-Out.
  - Leave Application submission & status tracking.
  - Downloadable PDF Salary Slips formatted for both mobile and desktop viewports.

## Tech Stack

- **Backend**: Python 3.14, Django 5.x, Django REST Framework, SimpleJWT, ReportLab, SQLite.
- **Frontend**: React 18/19, Vite, Tailwind CSS, Lucide Icons, Axios.

## Quick Start Guide

### 1. Backend Setup
```bash
cd backend
py -3.14 -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data  # Creates default Admin, Male & Female employee accounts
python manage.py runserver 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Demo Credentials
- **Admin**: `admin@dahera.com` / `Admin@123`
- **Male Employee**: `john.male@dahera.com` / `Employee@123` (Shift: 10:00 AM)
- **Female Employee**: `sarah.female@dahera.com` / `Employee@123` (Shift: 9:30 AM)
