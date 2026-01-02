# Masjid Ashraf ul Masjid - Donation Portal

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Admin User
Run the seed script to create a demo admin user:
```bash
npm run seed
```

This will create:
- Email: `admin@masjid.com`
- Password: `password123`

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Login
Use the following credentials to login:
- Email: `admin@masjid.com`
- Password: `password123`

## Database Configuration

The app uses MongoDB Atlas with the following connection string:
```
mongodb+srv://ahmadali43a5_db_user:XxtPvtGsB8FdAKSO@cluster0.88kglyd.mongodb.net/masjid_donation
```

## Features

- ✅ User Authentication (Login/Register)
- ✅ MongoDB Database Integration
- ✅ Password Hashing with bcryptjs
- ✅ Show/Hide Password Toggle
- ✅ Responsive Login UI

## Project Structure

```
app/
├── api/
│   └── auth/
│       ├── login/
│       └── register/
├── dashboard/
└── page.js (Login Page)

lib/
└── mongodb.js (Database Connection)

models/
└── User.js (User Schema)

seed.js (Database Seeding)
```

## Creating New Users

To create new users (admin, treasurer, etc.), you can:

1. Use the register API endpoint
2. Directly modify the user role in MongoDB
3. Create additional seed scripts

Enjoy!
