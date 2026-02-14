# Employee Leave Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing employee leave requests with role-based access control.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [How It Works](#how-it-works)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Future Improvements](#future-improvements)

---

## 🎯 Overview

This Employee Leave Management System allows employees to apply for leaves and track their status, while administrators can review, approve, or reject leave applications. The system features JWT-based authentication, role-based access control, and a clean, responsive user interface.

## ✨ Features

### For Employees:
- ✅ Register and login with secure authentication
- ✅ Apply for different types of leaves (Sick, Casual, Annual, etc.)
- ✅ View leave application history
- ✅ Track leave status (Pending, Approved, Rejected)
- ✅ Delete pending leave applications
- ✅ View admin comments on leave decisions

### For Administrators:
- ✅ View all employee leave applications
- ✅ Approve or reject leave requests
- ✅ Add comments when reviewing leaves
- ✅ View system-wide leave statistics
- ✅ Filter leaves by status

### General Features:
- ✅ JWT-based authentication
- ✅ Role-based access control (Employee/Admin)
- ✅ Responsive design for all devices
- ✅ Real-time form validation
- ✅ Secure password hashing with bcrypt
- ✅ RESTful API architecture

---

## 🛠️ Tech Stack

### Backend:
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing

### Frontend:
- **React.js** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Styling with modern design patterns

---

## 📁 Project Structure

```
employee-leave-management/
│
├── backend/                          # Backend Node.js application
│   ├── config/
│   │   └── db.js                     # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js         # Authentication logic (register, login)
│   │   └── leaveController.js        # Leave management logic (CRUD operations)
│   ├── middleware/
│   │   └── auth.js                   # JWT verification & role-based access
│   ├── models/
│   │   ├── User.js                   # User schema (employees & admins)
│   │   └── Leave.js                  # Leave application schema
│   ├── routes/
│   │   ├── authRoutes.js             # Authentication routes
│   │   └── leaveRoutes.js            # Leave management routes
│   ├── utils/
│   │   └── generateToken.js          # JWT token generation utility
│   ├── .env                          # Environment variables (not in git)
│   ├── .env.example                  # Environment variables template
│   ├── .gitignore                    # Git ignore file
│   ├── package.json                  # Backend dependencies
│   └── server.js                     # Express server entry point
│
└── frontend/                         # Frontend React application
    ├── public/
    │   └── index.html                # HTML template
    ├── src/
    │   ├── api/
    │   │   └── axios.js              # Axios configuration with interceptors
    │   ├── components/
    │   │   ├── Navbar.js             # Navigation bar component
    │   │   └── PrivateRoute.js       # Protected route wrapper
    │   ├── context/
    │   │   └── AuthContext.js        # Authentication context provider
    │   ├── pages/
    │   │   ├── Login.js              # Login page
    │   │   ├── Register.js           # Registration page
    │   │   ├── EmployeeDashboard.js  # Employee dashboard
    │   │   ├── ApplyLeave.js         # Leave application form
    │   │   ├── LeaveHistory.js       # Employee leave history
    │   │   ├── AdminDashboard.js     # Admin dashboard with statistics
    │   │   └── ManageLeaves.js       # Admin leave management page
    │   ├── App.js                    # Main app component with routing
    │   ├── index.js                  # React entry point
    │   └── index.css                 # Global styles
    ├── .gitignore                    # Git ignore file
    └── package.json                  # Frontend dependencies
```

---

## 🚀 Installation & Setup

### Prerequisites:
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

### Step 1: Clone or Navigate to Project Directory

```bash
cd employee-leave-management
```

### Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/employee-leave-management
   JWT_SECRET=your_secure_secret_key_here
   JWT_EXPIRE=7d
   ```

4. Start MongoDB:
   - If using local MongoDB:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```
   - If using MongoDB Atlas, update `MONGODB_URI` with your connection string

5. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Step 3: Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

---

## 🔄 How It Works

### Step-by-Step System Flow:

#### 1. **User Registration & Authentication**
   - New users register with name, email, password, department, and role (Employee/Admin)
   - Passwords are hashed using bcrypt before storing in database
   - Upon successful registration/login, a JWT token is generated
   - Token is stored in localStorage and sent with subsequent API requests

#### 2. **Employee Workflow**
   - **Dashboard**: View leave statistics (total, pending, approved, rejected)
   - **Apply Leave**: Fill form with leave type, dates, and reason
   - **Leave History**: View all submitted applications with status
   - **Delete**: Remove pending applications if needed

#### 3. **Admin Workflow**
   - **Dashboard**: View system-wide statistics and recent applications
   - **Manage Leaves**: Review all leave requests
   - **Review**: Click "Review" to see full details
   - **Action**: Approve or reject with optional comments
   - **Filter**: View leaves by status (All, Pending, Approved, Rejected)

#### 4. **Authorization Flow**
   - Every API request includes JWT token in Authorization header
   - Backend middleware verifies token and extracts user information
   - Role-based middleware restricts admin-only endpoints
   - Frontend routes are protected using PrivateRoute component

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user |

**Example - Register:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "department": "IT",
  "role": "employee"
}
```

**Example - Login:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Leave Management Routes (`/api/leaves`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/leaves` | Private (Employee/Admin) | Apply for leave |
| GET | `/api/leaves/my-leaves` | Private (Employee) | Get own leaves |
| GET | `/api/leaves/all` | Private (Admin) | Get all leaves |
| GET | `/api/leaves/stats` | Private (Admin) | Get leave statistics |
| GET | `/api/leaves/:id` | Private | Get single leave |
| PUT | `/api/leaves/:id` | Private (Admin) | Update leave status |
| DELETE | `/api/leaves/:id` | Private | Delete leave |

**Example - Apply Leave:**
```json
POST /api/leaves
Headers: { Authorization: "Bearer <token>" }
{
  "leaveType": "Sick Leave",
  "startDate": "2026-02-15",
  "endDate": "2026-02-17",
  "reason": "Medical appointment and recovery"
}
```

**Example - Update Leave Status (Admin):**
```json
PUT /api/leaves/:id
Headers: { Authorization: "Bearer <admin_token>" }
{
  "status": "Approved",
  "adminComment": "Approved. Get well soon!"
}
```

---

## 🔐 Authentication & Authorization

### How JWT Authentication Works:

1. **Token Generation:**
   - When user logs in, server generates a JWT token containing user ID
   - Token is signed with secret key from environment variables
   - Token expires after configured time (default: 7 days)

2. **Token Storage:**
   - Frontend stores token in localStorage along with user data
   - Token persists across browser sessions

3. **Token Verification:**
   - Every protected API request includes token in `Authorization: Bearer <token>` header
   - Backend middleware (`protect`) verifies token signature
   - If valid, user object is attached to request

4. **Role-Based Access:**
   - `protect` middleware: Ensures user is authenticated
   - `admin` middleware: Ensures user has admin role
   - Routes combine middlewares: `router.get('/all', protect, admin, getAllLeaves)`

### User Roles:

- **Employee**: Can apply for leaves, view own leave history, delete pending leaves
- **Admin**: All employee permissions + approve/reject leaves, view all applications, access statistics

---

## 🎨 Frontend Architecture

### State Management:
- **AuthContext**: Global authentication state using React Context API
- **localStorage**: Persists user data and token across sessions

### Routing:
- **Public Routes**: Login, Register
- **Private Routes**: Protected by PrivateRoute component
- **Role-Based Navigation**: Navbar shows different links for employees vs admins

### API Integration:
- **Axios Instance**: Configured with base URL and request interceptor
- **Interceptor**: Automatically adds JWT token to all requests
- **Error Handling**: Displays user-friendly error messages

---

## 🚀 Future Improvements

### Potential Enhancements:

1. **Email Notifications**
   - Send email when leave is approved/rejected
   - Notify admins of new leave applications

2. **Leave Balance Tracking**
   - Track available leave days per employee
   - Deduct from balance when approved
   - Show remaining leave days on dashboard

3. **Calendar Integration**
   - Visual calendar showing leave dates
   - Team calendar to see who's on leave

4. **Advanced Filtering & Search**
   - Search by employee name, department
   - Date range filters
   - Export to CSV/PDF

5. **Leave Types Configuration**
   - Admin can configure leave types
   - Set different quotas per leave type

6. **Multi-level Approval**
   - Manager approval before HR approval
   - Configurable approval workflows

7. **Mobile App**
   - React Native mobile application
   - Push notifications

8. **Analytics Dashboard**
   - Leave trends and patterns
   - Department-wise statistics
   - Graphical reports

9. **File Attachments**
   - Upload medical certificates
   - Supporting documents for leave

10. **Audit Trail**
    - Track all changes to leave applications
    - View history of status changes

---

## 📝 Sample Test Accounts

After setting up, you can create test accounts:

**Admin Account:**
- Email: admin@example.com
- Password: admin123
- Role: Admin
- Department: HR

**Employee Account:**
- Email: employee@example.com
- Password: employee123
- Role: Employee
- Department: IT

---

## 🐛 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env` file
   - Verify network connectivity for MongoDB Atlas

2. **CORS Errors:**
   - Backend has CORS enabled by default
   - Ensure frontend proxy is set to `http://localhost:5000` in `package.json`

3. **Token Errors:**
   - Clear localStorage and login again
   - Check `JWT_SECRET` is set in `.env`

4. **Port Already in Use:**
   - Change `PORT` in backend `.env` file
   - Kill process using the port

---

## 📄 License

This project is open-source and available for educational purposes.

---

## 👨‍💻 Developer Notes

- All passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens are stateless and contain only user ID
- MongoDB indexes can be added for better query performance
- Frontend uses CSS variables for easy theme customization
- All API responses follow consistent format: `{ success, message, data }`

---

## 🎉 Getting Started

1. Install dependencies for both backend and frontend
2. Start MongoDB
3. Run backend server: `npm run dev` in backend folder
4. Run frontend server: `npm start` in frontend folder
5. Register a new admin account
6. Register employee accounts
7. Start managing leaves!

**Enjoy using the Employee Leave Management System! 🚀**
