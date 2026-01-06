# LMS - Learning Management System

A comprehensive Learning Management System for the MJF Charity Foundation, designed to facilitate educational management and delivery for students, teachers, administrators, and parents.

#Architecture

<img width="1413" height="676" alt="image" src="https://github.com/user-attachments/assets/1981ecce-f96d-4f79-9f34-116729e0a0be" />

## Features

### Multi-Role System
- **Teachers**: manage exams, track student's progress
- **Administrators**: Oversee system operations, manage users


### Core Functionality
- student's management and enrollment
- Exam creation 
- User authentication and authorization
- File upload and management
- Progress tracking and analytics
- QR code generation for easy access

## Tech Stack

### Frontend
- **React 19.1.1** - Modern React with latest features
- **Vite 7.1.2** - Fast build tool and development server
- **React Router 7.8.2** - Client-side routing
- **TailwindCSS 3.4.18** - Utility-first CSS framework
- **Framer Motion 12.23.12** - Animation library
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.2.1** - Web framework
- **MongoDB/Mongoose 9.0.2** - Database and ODM
- **MySQL2 2.3.3** - MySQL database driver
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Nodemon** - Development auto-restart

##  Project Structure

```
LMS/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── server.js       # Server entry point
│   ├── database/           # Database configurations
│   └── uploads/           # File upload directory
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main App component
│   └── public/            # Static assets
├── MIGRATION_GUIDE.md     # Database migration guide
└── package.json           # Root dependencies
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB or MySQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LMS
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Setup

1. **Backend Environment (.env)**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lms
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=lms
   JWT_SECRET=your_jwt_secret
   ```

2. **Frontend Environment (.env)**
   ```
   VITE_API_URL=http://localhost:5000
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin only)

### Classes
- `GET /api/classes` - Get all courses
- `POST /api/classes` - Create new course (teacher/admin)
- `GET /api/classes/:id` - Get course by ID
- `PUT /api/classes/:id` - Update course (teacher/admin)
- `DELETE /api/classes/:id` - Delete course (admin only)

### teachers
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create new teachers (admin)
- `GET /api/teachers/:id` - Get teacher by ID
- `PUT /api/teachers/:id` - Update teacher (teacher/admin)
- `DELETE /api/teachers/:id` - Delete teachers (admin only)

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new students (admin)
- `GET /api/students/:id` - Get students by ID
- `PUT /api/students/:id` - Update students (teacher/admin)
- `DELETE /api/students/:id` - Delete students (admin)



## Authentication & Security

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcryptjs
- CORS enabled for cross-origin requests
- File upload validation and security


## Database Migration

For detailed migration instructions from Firebase to Supabase, refer to the [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.


