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
