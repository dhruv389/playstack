# Orbit — Employee Management System (Frontend)

A fully client-side Employee Management System built with **React + Vite + TypeScript + Tailwind CSS v4**. All data is mocked and persisted to `localStorage`, so the app is fully interactive without a backend.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Demo accounts

Use the quick-fill buttons on the login screen, or sign in manually:

| Role         | Email                     | Password   |
|--------------|---------------------------|------------|
| Super Admin  | aarav.sharma@orbit.io     | admin123   |
| HR Manager   | priya.nair@orbit.io       | hr123      |
| Employee     | karan.joshi@orbit.io      | emp123     |

## Features implemented

- **Auth**: mock login/logout, protected routes, session persistence (`sessionStorage`), route-level and role-level guards.
- **RBAC**: Super Admin (full CRUD + role/manager assignment), HR Manager (create/edit/view, no delete, cannot assign Super Admin), Employee (view/edit own profile only, limited fields).
- **Dashboard**: total / active / inactive employee counts, department count, department bar chart, active-vs-inactive donut chart, recent joiners.
- **Employee management**: CRUD with full field set (ID, name, email, phone, department, designation, salary, joining date, status, role, reporting manager, profile image), soft delete + restore, CSV import (with template) and CSV export.
- **Organization hierarchy**: assign reporting manager, circular-reporting prevention, collapsible reporting tree, direct reports list on each profile.
- **Search, filter, sort**: search by name/email, filter by department/role/status, sort by name/joining date/salary, pagination.
- **Validation**: client-side validation for email, phone, salary, required fields, and joining date.
- **Dark mode**: system-aware default with manual toggle, persisted.
- **Responsive**: collapsible sidebar and stacked layouts on mobile/tablet.

## Notes

This is a frontend-only build — all API calls described in the assignment (`/api/auth/login`, `/api/employees`, `/api/organization/tree`, etc.) are simulated in `src/context` using local state + `localStorage`, so the UI/UX and interaction patterns match what a real backend integration would look like. Swapping the context providers for real `fetch`/`axios` calls to your Express API is the natural next step.

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- react-router-dom (routing + guards)
- recharts (dashboard charts)
- papaparse (CSV import/export)
- lucide-react (icons)
- react-hot-toast (notifications)
