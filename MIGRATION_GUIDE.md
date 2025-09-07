<!-- # Firebase to Supabase Migration Guide

## Overview
This guide will help you complete the migration from Firebase to Supabase for your LMS application.

## Prerequisites
1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in Supabase
3. Get your project credentials (URL and API keys)

## Step 1: Set up Supabase Project

### 1.1 Create Database Tables
Run the following SQL commands in your Supabase SQL editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin', 'parent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Assignments table
CREATE TABLE assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);
```

### 1.2 Set up Row Level Security (RLS)
Enable RLS on all tables and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Anyone can view courses" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Teachers and admins can manage courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('teacher', 'admin')
    )
  );

-- Enrollments policies
CREATE POLICY "Users can view their enrollments" ON enrollments
  FOR SELECT USING (
    auth.uid() = student_id OR 
    auth.uid() = teacher_id
  );

CREATE POLICY "Teachers and admins can manage enrollments" ON enrollments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('teacher', 'admin')
    )
  );

-- Assignments policies
CREATE POLICY "Anyone can view assignments" ON assignments
  FOR SELECT USING (true);

CREATE POLICY "Teachers and admins can manage assignments" ON assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('teacher', 'admin')
    )
  );

-- Submissions policies
CREATE POLICY "Students can view and manage their submissions" ON submissions
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view all submissions" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('teacher', 'admin')
    )
  );
```

## Step 2: Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
Create a `.env` file in the `frontend` directory:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 3: Install Dependencies

### Backend
```bash
cd backend
npm install @supabase/supabase-js
npm uninstall firebase firebase-admin
```

### Frontend
```bash
cd frontend
npm install @supabase/supabase-js
npm uninstall firebase
```

## Step 4: Migration Status

### ✅ Completed
- [x] Updated backend package.json to use Supabase
- [x] Created Supabase configuration for backend
- [x] Updated authentication middleware
- [x] Updated user routes
- [x] Updated server.js
- [x] Updated frontend package.json
- [x] Created Supabase configuration for frontend
- [x] Created Supabase helpers
- [x] Updated App.jsx
- [x] Updated Login page

### 🔄 Next Steps
1. Set up your Supabase project and run the SQL commands above
2. Add your environment variables
3. Install the new dependencies
4. Test the application
5. Remove old Firebase files (see cleanup section below)

## Step 5: Cleanup (After Testing)

Remove these Firebase-related files:
- `firestore.rules`
- `firestore-simple.rules`
- `firestore.indexes.json`
- `firebase.json`
- `deploy-firestore-rules.sh`
- `test-firestore.html`
- `backend/src/config/firebase.js`
- `backend/src/config/firebaseServiceAccount.json`
- `frontend/src/firebaseConfig.js`
- `frontend/src/utils/firebaseHelpers.js`
- `frontend/src/utils/firestoreTest.js`

## Step 6: Testing

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Test user registration and login
4. Verify that user roles are working correctly
5. Test database operations

## Troubleshooting

### Common Issues
1. **Environment variables not loading**: Make sure your `.env` files are in the correct directories
2. **RLS policies blocking access**: Check that your policies match your application's access patterns
3. **Authentication errors**: Verify that your Supabase URL and keys are correct

### Getting Help
- Check the [Supabase documentation](https://supabase.com/docs)
- Review the Supabase dashboard for error logs
- Check browser console for frontend errors
- Check backend console for server errors

## Benefits of Migration

1. **Better Performance**: Supabase uses PostgreSQL which is more performant than Firestore for complex queries
2. **Real-time Features**: Built-in real-time subscriptions
3. **Better SQL Support**: Full SQL capabilities with proper relationships
4. **Cost Effective**: More predictable pricing model
5. **Open Source**: Self-hostable if needed
6. **Better Developer Experience**: More intuitive API and better tooling -->
