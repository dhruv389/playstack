# Orbit EMS — Employee Management System

A full-stack Employee Management System built with React + TypeScript, Node.js + Express, and MongoDB.

---

## Tech Stack

| Layer      | Technology                                |
|------------|-------------------------------------------|
| Frontend   | React 19, TypeScript, Tailwind CSS v4, Vite |
| Backend    | Node.js, Express.js                       |
| Database   | MongoDB Atlas (Mongoose ODM)              |
| Auth       | JWT + bcryptjs                            |
| Charts     | Recharts                                  |
| Icons      | Lucide React                              |

---

## Features

### Authentication
- JWT-based login/logout with bcrypt password hashing
- Token stored in localStorage, validated on reload via `/api/auth/me`
- Protected routes redirect unauthenticated users to `/login`

### Role-Based Access Control
| Feature                    | Super Admin | HR Manager | Employee     |
|----------------------------|:-----------:|:----------:|:------------:|
| View all employees         | ✅          | ✅         | Own only     |
| Create employee            | ✅          | ✅         | ❌           |
| Edit employee              | ✅          | ✅         | Own profile  |
| Delete employee            | ✅          | ❌         | ❌           |
| Assign Super Admin role    | ✅          | ❌         | ❌           |
| Edit Super Admin records   | ✅          | ❌         | ❌           |
| Restore deleted employees  | ✅          | ❌         | ❌           |

### Dashboard
- Stats: Total / Active / Inactive employees, Department count
- Bar chart: Headcount by department
- Pie chart: Active vs Inactive workforce
- Recent joiners list

### Employee Management
- Full CRUD with all required fields
- Soft delete (moved to Deleted tab, restorable)
- Pagination (8 per page)
- Search by name/email
- Filter by department, role, status
- Sort by name, joining date, salary
- CSV bulk import + export
- Profile image URL support

### Organizational Hierarchy
- Assign reporting managers
- Circular reporting prevention (both frontend + backend)
- Visual org tree with expand/collapse
- Direct reports panel on employee detail page

### Bonus Features
- ✅ Pagination
- ✅ Soft Delete
- ✅ CSV Import/Export
- ✅ Dashboard Charts
- ✅ Dark Mode

---

## Project Structure

```
Playstack/
├── ems-frontend/          # React + TypeScript frontend
│   └── src/
│       ├── components/    # UI components (auth, dashboard, employees, layout, org, ui)
│       ├── context/       # AuthContext, EmployeeContext, ThemeContext
│       ├── hooks/         # useDebounce, useLocalStorage
│       ├── lib/           # api.ts — central API client
│       ├── pages/         # Dashboard, Employees, EmployeeDetail, Org, Login, Profile
│       ├── routes/        # AppRoutes (ProtectedRoute + RoleGuard)
│       ├── types/         # Shared TypeScript types
│       └── utils/         # csv, helpers, validation
└── server/                # Node.js + Express backend
    ├── config/            # db.js — MongoDB connection
    ├── controllers/       # authController, employeeController, organizationController
    ├── middleware/         # auth.js (JWT protect), rbac.js (authorize)
    ├── models/            # Employee.js, User.js
    ├── routes/            # auth.js, employees.js, organization.js
    └── scripts/           # seed.js — 68 demo employees
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)

### 1. Backend Setup

```bash
cd server
npm install
```

Create `.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Seed the database:
```bash
node scripts/seed.js
```

Start the server:
```bash
npm run dev      # development (nodemon)
npm start        # production
```

### 2. Frontend Setup

```bash
cd ems-frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api` requests to `http://localhost:5000`.

---

## Demo Credentials

| Role        | Email                       | Password   |
|-------------|---------------------------- |------------|
| Super Admin | aarav.sharma@orbit.io       | admin123   |
| HR Manager  | priya.nair@orbit.io         | hr123      |
| Employee    | karan.joshi@orbit.io        | emp123     |

---

## API Documentation

See [API.md](./API.md) for full endpoint reference.
