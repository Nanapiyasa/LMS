# Migration Guide: Supabase to SQL Database (Navicat)

This guide will help you migrate from Supabase to a SQL database managed with Navicat.

## Prerequisites

1. MySQL/MariaDB database server installed and running
2. Navicat or another SQL database management tool
3. Node.js and npm installed

## Step 1: Database Setup

1. Open Navicat and connect to your MySQL/MariaDB server
2. Create a new database named `lms` (or use the name from your `.env` file)
3. Run the SQL schema file located at `backend/database/schema.sql`
   - This will create all necessary tables (users, classes, enrollments)

## Step 2: Install Dependencies

### Backend
```bash
cd backend
npm install mysql2
npm uninstall @supabase/supabase-js
```

### Frontend
```bash
cd frontend
npm uninstall @supabase/supabase-js
```

## Step 3: Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lms
DB_PORT=3306
JWT_SECRET=your-secret-key-change-this-to-something-secure
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 4: Update Database Connection

1. Open Navicat and ensure your database is accessible
2. Update the `DB_HOST`, `DB_USER`, `DB_PASSWORD` in your backend `.env` file
3. Test the connection by running the backend server

## Step 5: Create Initial Admin User

You can create an admin user directly in Navicat:

```sql
INSERT INTO users (email, password, name, role) 
VALUES ('admin@lms.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Admin User', 'admin');
```

Or use the registration endpoint:
```bash
POST http://localhost:5000/api/auth/register
{
  "email": "admin@lms.com",
  "password": "admin123",
  "name": "Admin User",
  "role": "admin"
}
```

## Step 6: Start the Application

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

## Step 7: Test the Migration

1. Try logging in with your admin credentials
2. Verify that user data is stored in your SQL database
3. Check that all API endpoints are working correctly

## Key Changes Made

### Backend
- ✅ Replaced Supabase client with MySQL connection pool
- ✅ Updated authentication to use JWT tokens
- ✅ Created new API endpoints for auth (`/api/auth/login`, `/api/auth/register`)
- ✅ Updated middleware to verify JWT tokens instead of Supabase tokens

### Frontend
- ✅ Created API service layer (`frontend/src/services/api.js`)
- ✅ Updated AuthContext to use API calls instead of Supabase
- ✅ Removed all Supabase client imports
- ✅ Updated Profile and ParentDashboard components

## Database Schema

The database includes:
- **users**: Stores user accounts with email, password (hashed), name, and role
- **classes**: Stores class information (for future use)
- **enrollments**: Stores student-class relationships (for future use)

## Troubleshooting

### Connection Issues
- Verify database credentials in `.env` file
- Ensure MySQL server is running
- Check firewall settings if connecting remotely

### Authentication Issues
- Verify JWT_SECRET is set in backend `.env`
- Check that tokens are being stored in localStorage
- Verify API_URL is correct in frontend `.env`

### Migration Issues
- Ensure all Supabase dependencies are removed
- Clear browser cache and localStorage
- Restart both backend and frontend servers

## Next Steps

1. Migrate any existing data from Supabase to your SQL database
2. Update any remaining Supabase references in your codebase
3. Set up database backups
4. Configure production environment variables






