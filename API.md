# Orbit EMS — API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication

### POST /api/auth/login
Login with email and password. Returns a JWT token.

**Request Body:**
```json
{
  "email": "aarav.sharma@orbit.io",
  "password": "admin123"
}
```

**Response 200:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "6649abc...",
    "name": "Aarav Sharma",
    "email": "aarav.sharma@orbit.io",
    "role": "Super Admin",
    "profileImage": "https://i.pravatar.cc/150?img=1",
    "employeeRecordId": "6649abc..."
  }
}
```

**Error responses:** `400` missing fields · `401` wrong email/password · `403` deactivated

---

### POST /api/auth/logout
🔒 Protected. Acknowledges logout (client drops the token).

**Response 200:**
```json
{ "success": true, "message": "Logged out successfully" }
```

---

### GET /api/auth/me
🔒 Protected. Returns the currently authenticated user.

**Response 200:**
```json
{
  "success": true,
  "user": { "id": "...", "name": "...", "role": "Super Admin", ... }
}
```

---

## Employees

### GET /api/employees
🔒 Protected. Returns paginated, filtered, sorted employee list.

**Query Parameters:**
| Parameter  | Type    | Description                                      |
|------------|---------|--------------------------------------------------|
| search     | string  | Search by name or email (case-insensitive)       |
| department | string  | Filter by department name                        |
| role       | string  | Filter by role (`Super Admin`, `HR Manager`, `Employee`) |
| status     | string  | Filter by status (`Active`, `Inactive`)          |
| sortBy     | string  | Sort field: `name`, `joiningDate`, `salary`      |
| sortDir    | string  | `asc` or `desc` (default: `asc`)                 |
| page       | number  | Page number (default: 1)                         |
| limit      | number  | Results per page (default: 50, max: 100)         |
| deleted    | boolean | `true` to fetch soft-deleted employees           |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "6649abc...",
      "employeeId": "ORB-1001",
      "name": "Aarav Sharma",
      "email": "aarav.sharma@orbit.io",
      "phone": "+91 98200 11001",
      "department": "Engineering",
      "designation": "C-Level",
      "salary": 5200000,
      "joiningDate": "2018-01-15T00:00:00.000Z",
      "status": "Active",
      "role": "Super Admin",
      "reportingManagerId": null,
      "profileImage": "https://i.pravatar.cc/150?img=1",
      "address": "",
      "isDeleted": false
    }
  ],
  "pagination": {
    "total": 68,
    "page": 1,
    "limit": 50,
    "totalPages": 2
  }
}
```

> **RBAC:** Employees only receive their own record. HR + Super Admin see all.

---

### POST /api/employees
🔒 Protected · Super Admin, HR Manager only.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@orbit.io",
  "phone": "+91 98765 43210",
  "department": "Engineering",
  "designation": "Associate",
  "salary": 1200000,
  "joiningDate": "2024-01-15",
  "status": "Active",
  "role": "Employee",
  "reportingManagerId": "6649abc...",
  "profileImage": "https://i.pravatar.cc/150?img=5",
  "address": "Bangalore, India"
}
```

**Response 201:** Returns created employee object.

**Errors:** `400` validation error or duplicate email · `403` HR trying to create Super Admin

---

### GET /api/employees/:id
🔒 Protected. Returns a single employee by MongoDB ID.

**Response 200:** Returns employee object.

**Errors:** `400` invalid ID · `403` Employee accessing someone else's record · `404` not found

---

### PUT /api/employees/:id
🔒 Protected. Update employee fields.

- **Super Admin:** Can update all fields
- **HR Manager:** Can update all fields except Super Admin records
- **Employee:** Can only update `phone`, `address`, `profileImage` on own record

**Request Body:** Any subset of employee fields.

**Response 200:** Returns updated employee object.

**Errors:** `400` validation / invalid manager · `403` access denied

---

### DELETE /api/employees/:id
🔒 Protected · Super Admin only. **Soft delete** — sets `isDeleted: true`, `status: Inactive`.

**Response 200:**
```json
{ "success": true, "message": "Employee soft deleted", "data": { ... } }
```

---

### PATCH /api/employees/:id/restore
🔒 Protected · Super Admin only. Restores a soft-deleted employee.

**Response 200:**
```json
{ "success": true, "message": "Employee restored", "data": { ... } }
```

---

### PATCH /api/employees/:id/manager
🔒 Protected · Super Admin, HR Manager.

**Request Body:**
```json
{ "managerId": "6649abc..." }
```
Pass `null` to remove the manager (set as top-level).

**Response 200:** Returns updated employee.

**Errors:** `400` circular reporting chain detected

---

### GET /api/employees/:id/reportees
🔒 Protected. Returns direct reports of an employee.

**Response 200:**
```json
{
  "success": true,
  "data": [ { ...employee }, ... ]
}
```

---

### POST /api/employees/bulk-import
🔒 Protected · Super Admin, HR Manager.

**Request Body:**
```json
{
  "rows": [
    {
      "name": "Jane Doe",
      "email": "jane.doe@orbit.io",
      "phone": "+91 98765 43210",
      "department": "Engineering",
      "designation": "Associate",
      "salary": "1200000",
      "joiningDate": "2024-01-15",
      "status": "Active"
    }
  ]
}
```

**Response 200:**
```json
{
  "success": true,
  "imported": 3,
  "skipped": 1,
  "errors": ["Skipped: jane.doe@orbit.io already exists"]
}
```

---

## Organization

### GET /api/organization/tree
🔒 Protected. Returns the full reporting hierarchy.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Aarav Sharma",
      "role": "Super Admin",
      "children": [
        {
          "id": "...",
          "name": "Priya Nair",
          "children": [ ... ]
        }
      ]
    }
  ],
  "flat": [ ...all employees as flat array... ]
}
```

---

## Validation Rules

### Frontend (src/utils/validation.ts)
| Field       | Rule                                          |
|-------------|-----------------------------------------------|
| Email       | Required, valid format (regex)               |
| Phone       | Required, 7–15 digits, allows `+`, spaces, `-` |
| Name        | Required, non-empty                          |
| Salary      | Required, number, 1 – 100,000,000           |
| Joining Date| Required, valid date, not in the future      |

### Backend (Mongoose validators)
| Field       | Rule                                          |
|-------------|-----------------------------------------------|
| Email       | Required, unique, valid format               |
| Name        | Required                                     |
| Salary      | Required, min 1, max 100,000,000             |
| Joining Date| Required                                     |
| Department  | Enum of 9 valid departments                  |
| Designation | Enum of 9 valid designations                 |
| Role        | Enum: Super Admin, HR Manager, Employee      |
| Status      | Enum: Active, Inactive                       |
| Password    | Required, min 5 characters                   |

---

## Error Response Format

All errors follow this shape:
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

## HTTP Status Codes Used
| Code | Meaning                        |
|------|--------------------------------|
| 200  | OK                             |
| 201  | Created                        |
| 400  | Bad Request / Validation Error |
| 401  | Unauthorized (no/invalid token)|
| 403  | Forbidden (RBAC denied)        |
| 404  | Not Found                      |
| 500  | Internal Server Error          |
