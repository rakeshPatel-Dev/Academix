# Academix - Academic Management System

## Overview

Academix is a full-stack web application for managing academic institutions. It provides role-based access for Admins, Teachers, and Students to handle courses, student enrollments, teacher assignments, and more. Built with modern technologies for scalability and user-friendly interface.

## ✨ Features

- **Role-based Authentication**: Secure login for Admins, Teachers, Students using JWT.
- **Dashboard**: Overview with charts and data statistics (students, teachers, courses).
- **CRUD Operations**:
  - Manage Admins (create, edit, view profiles)
  - Manage Students (create, edit, enroll in courses, profiles)
  - Manage Teachers (create, edit, assign courses, profiles)
  - Manage Courses (create, edit, assign to teachers/students)
- **Responsive UI**: TailwindCSS-powered interface with charts (Chart.js), forms (React Hook Form), and notifications (React Hot Toast).
- **Protected Routes**: Authentication guards for sensitive pages.
- **MongoDB Integration**: Persistent data storage with Mongoose ODM.

## 🛠️ Tech Stack

### Backend
- **Node.js / Express.js** (ES Modules)
- **MongoDB** (via Mongoose)
- **Authentication**: JWT, bcryptjs
- **Other**: dotenv, cors, cookie-parser
- **Package Manager**: pnpm

### Frontend
- **React 19** with Vite (HMR)
- **TailwindCSS 4**
- **React Router 7**
- **State/Tools**: Axios (API calls), React Hook Form, lodash, Lucide React (icons)
- **Charts**: Chart.js + react-chartjs-2
- **Notifications**: react-hot-toast
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js (v20+ recommended)
- MongoDB (local or cloud like MongoDB Atlas)
- pnpm (v10+)

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```

### 2. Environment Setup

Create `.env` in `backend/`:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/academix
JWT_SECRET=your-super-secret-jwt-key-here
```

Update `MONGO_URI` for your MongoDB instance.

### 3. Run the Application

Open multiple terminals:

**Backend:**
```bash
cd backend
pnpm dev
```
Server runs on `http://localhost:3000`

**Frontend:**
```bash
cd frontend
pnpm dev
```
App runs on `http://localhost:5173` (proxies API to backend)

### 4. Access the App

- Open `http://localhost:5173`
- Register/Login as Admin/Teacher/Student
- Explore Dashboard, manage resources

## 🌐 API Endpoints

Base URL: `http://localhost:3000/api`

| Method | Endpoint              | Description             | Auth |
|--------|-----------------------|-------------------------|------|
| POST   | /auth/register        | Register user           | -    |
| POST   | /auth/login           | Login user              | -    |
| GET    | /students             | Get all students        | Yes  |
| POST   | /students             | Create student          | Yes  |
| ...    | (See backend/routes)  | Full CRUD for resources | Yes  |

## 📁 Project Structure

```
Academix/
├── backend/          # Express API server
│   ├── src/
│   │   ├── models/   # Mongoose schemas
│   │   ├── routes/   # API routes
│   │   ├── controllers/
│   │   └── config/
├── frontend/         # React + Vite app
│   ├── src/
│   │   ├── pages/    # Views (Dashboard, CRUD pages)
│   │   ├── components/ # Reusable UI
│   │   └── hooks/    # Custom hooks (auth, data)
└── README.md         # This file
```

## 🧪 Testing

Backend: No tests yet (`pnpm test`).

Frontend: ESLint (`pnpm lint`).

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

ISC License (see `backend/package.json`)

## 🙌 Acknowledgments

Built with ❤️ using open-source tools. Contributions welcome!
