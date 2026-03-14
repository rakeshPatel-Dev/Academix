# Academix -- Academic Management System

## Overview

**Academix** is a full-stack academic management platform designed to
help institutions manage students, teachers, and courses from a single
system.

The platform provides **role-based dashboards for administrators,
teachers, and students**, allowing them to perform their respective
tasks such as managing courses, assigning teachers, enrolling students,
and tracking institutional data.

The system is built with a modern **MERN-style architecture** to ensure
scalability, maintainability, and a responsive user experience.

------------------------------------------------------------------------

# ✨ Features

### Role-Based Authentication

Secure authentication system using **JWT** and **bcrypt** that supports
three roles:

-   Admin
-   Teacher
-   Student

Each role has **separate permissions and dashboards**.

### Academic Resource Management

The system supports full management of academic entities:

**Admins can** - Create and manage students - Create and manage
teachers - Create and manage courses - Assign teachers to courses -
Enroll students into courses

**Teachers can** - View assigned courses - Access student information
for their courses

**Students can** - View enrolled courses - Access course details

------------------------------------------------------------------------

### Dashboard Analytics

Interactive dashboards provide quick insights into institutional data
such as:

-   Total students
-   Total teachers
-   Total courses
-   Enrollment distribution

Charts are built using **Chart.js** for visual data representation.

------------------------------------------------------------------------

### Email Notification Service

Academix includes a **dedicated email service layer** responsible for
sending system emails.

Email notifications are used for events such as:

-   User registration
-   Account updates
-   Course assignments
-   System notifications

The service is implemented using **Nodemailer** and a centralized
**email service module**, ensuring email logic is separated from
controllers for better maintainability.

------------------------------------------------------------------------

### Secure Protected Routes

Sensitive routes are protected using:

-   JWT authentication middleware
-   Role-based authorization checks

This ensures only authorized users can access restricted resources.

------------------------------------------------------------------------

### Responsive User Interface

The frontend is designed using **TailwindCSS** and provides:

-   Fully responsive layout
-   Interactive forms
-   Toast notifications
-   Dynamic charts

------------------------------------------------------------------------

# 🛠 Tech Stack

## Backend

-   **Node.js**
-   **Express.js**
-   **MongoDB** with Mongoose
-   **JWT Authentication**
-   **bcrypt** for password hashing
-   **Nodemailer** for email services
-   **dotenv** for environment configuration
-   **cors**
-   **cookie-parser**

Package manager: **pnpm**

------------------------------------------------------------------------

## Frontend

-   **React 19**
-   **Vite**
-   **TailwindCSS**
-   **React Router**
-   **Axios**
-   **React Hook Form**
-   **Chart.js**
-   **React Chartjs 2**
-   **Lucide React**
-   **React Hot Toast**

Package manager: **pnpm**

------------------------------------------------------------------------

# 📋 Prerequisites

Before running the project, make sure the following tools are installed:

-   **Node.js (v20 or higher)**
-   **MongoDB** (local instance or MongoDB Atlas)
-   **pnpm**

------------------------------------------------------------------------

# 🚀 Installation & Setup

## 1. Clone the Repository

``` bash
git clone https://github.com/your-username/academix.git
cd academix
```

------------------------------------------------------------------------

## 2. Install Dependencies

### Backend

``` bash
cd backend
pnpm install
```

### Frontend

``` bash
cd ../frontend
pnpm install
```

------------------------------------------------------------------------

## 3. Environment Configuration

Create a `.env` file inside the **backend** directory.

    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/academix
    JWT_SECRET=your-super-secret-jwt-key

    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your-email@gmail.com
    SMTP_PASS=your-app-password
    SMTP_FROM="Academic System" <your-email@gmail.com>
    SMTP_SERVICE=gmail

These variables configure:

-   database connection
-   authentication secrets
-   email service credentials

------------------------------------------------------------------------

## 4. Run the Application

Open two terminals.

### Start Backend Server

``` bash
cd backend
pnpm dev
```

Backend runs at:

    http://localhost:3000

------------------------------------------------------------------------

### Start Frontend

``` bash
cd frontend
pnpm dev
```

Frontend runs at:

    http://localhost:5173

The frontend automatically proxies API requests to the backend.

------------------------------------------------------------------------

# 🌐 API Overview

Base URL:

    http://localhost:3000/api

  Method   Endpoint         Description        Auth
  -------- ---------------- ------------------ ------
  POST     /auth/register   Register user      No
  POST     /auth/login      Login user         No
  GET      /students        Get all students   Yes
  POST     /students        Create student     Yes
  GET      /teachers        Get all teachers   Yes
  POST     /teachers        Create teacher     Yes
  GET      /courses         Get all courses    Yes
  POST     /courses         Create course      Yes

All protected routes require **JWT authentication**.

------------------------------------------------------------------------

# 📁 Project Structure

    Academix
    │
    ├── backend
    │   └── src
    │       ├── models
    │       ├── routes
    │       ├── controllers
    │       ├── services      # Email services and business logic
    │       ├── middleware    # Auth & authorization middleware
    │       └── config
    │
    ├── frontend
    │   └── src
    │       ├── pages
    │       ├── components
    │       ├── hooks
    │       ├── services      # API communication layer
    │       └── utils
    │
    └── README.md

------------------------------------------------------------------------

# 🧪 Development Tools

Frontend code quality is maintained using:

    pnpm lint

Testing support can be added later using tools like **Jest** or
**Vitest**.

------------------------------------------------------------------------

# 📄 License

This project is licensed under the **ISC License**.

See `backend/package.json` for details.

------------------------------------------------------------------------

# 🙌 Acknowledgments

This project is built using modern open-source technologies including
**React, Express, MongoDB, TailwindCSS, and Node.js**.
