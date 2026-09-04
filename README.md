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
