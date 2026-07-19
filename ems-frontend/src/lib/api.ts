/**
 * Central API client for EMS backend.
 * All calls go through this module — handles auth token injection and error normalization.
 */

const BASE_URL = '/api'

// Token helpers
export const getToken = (): string | null => localStorage.getItem('ems-token')
export const setToken = (token: string) => localStorage.setItem('ems-token', token)
export const clearToken = () => localStorage.removeItem('ems-token')

interface ApiOptions extends RequestInit {
  skipAuth?: boolean
}

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  if (!skipAuth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`)
  }

  return data as T
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'Super Admin' | 'HR Manager' | 'Employee'
  profileImage: string
  employeeRecordId: string | null
}

export interface LoginResponse {
  success: boolean
  token: string
  user: AuthUser
}

export const authApi = {
  login: (email: string, password: string) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    }),

  logout: () =>
    request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    }),

  me: () => request<{ success: boolean; user: AuthUser }>('/auth/me'),
}

// ─── Employees ───────────────────────────────────────────────────────────────

export interface EmployeeApiParams {
  search?: string
  department?: string
  role?: string
  status?: string
  sortBy?: string
  sortDir?: string
  page?: number
  limit?: number
  deleted?: boolean
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface EmployeesResponse {
  success: boolean
  data: EmployeeShape[]
  pagination: PaginationMeta
}

export interface EmployeeShape {
  id: string
  _id: string
  employeeId: string
  name: string
  email: string
  phone: string
  department: string
  designation: string
  salary: number
  joiningDate: string
  status: 'Active' | 'Inactive'
  role: 'Super Admin' | 'HR Manager' | 'Employee'
  reportingManagerId: string | null
  profileImage: string
  address?: string
  isDeleted?: boolean
}

export interface SingleEmployeeResponse {
  success: boolean
  data: EmployeeShape
}

export interface BulkImportResponse {
  success: boolean
  imported: number
  skipped: number
  errors: string[]
}

const buildQuery = (params: Record<string, unknown>) => {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, String(v))
  })
  return q.toString() ? `?${q.toString()}` : ''
}

export const employeeApi = {
  getAll: (params: EmployeeApiParams = {}) => {
    const { deleted, ...rest } = params
    return request<EmployeesResponse>(
      `/employees${buildQuery({ ...rest, deleted: deleted ? 'true' : 'false' })}`
    )
  },

  getOne: (id: string) => request<SingleEmployeeResponse>(`/employees/${id}`),

  create: (data: Partial<EmployeeShape>) =>
    request<SingleEmployeeResponse>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<EmployeeShape>) =>
    request<SingleEmployeeResponse>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  softDelete: (id: string) =>
    request<SingleEmployeeResponse>(`/employees/${id}`, { method: 'DELETE' }),

  restore: (id: string) =>
    request<SingleEmployeeResponse>(`/employees/${id}/restore`, { method: 'PATCH' }),

  assignManager: (id: string, managerId: string | null) =>
    request<SingleEmployeeResponse>(`/employees/${id}/manager`, {
      method: 'PATCH',
      body: JSON.stringify({ managerId }),
    }),

  getReportees: (id: string) =>
    request<{ success: boolean; data: EmployeeShape[] }>(`/employees/${id}/reportees`),

  bulkImport: (rows: Partial<EmployeeShape>[]) =>
    request<BulkImportResponse>('/employees/bulk-import', {
      method: 'POST',
      body: JSON.stringify({ rows }),
    }),
}

// ─── Organization ─────────────────────────────────────────────────────────────

export interface OrgTreeResponse {
  success: boolean
  data: EmployeeShape[]
  flat: EmployeeShape[]
}

export const organizationApi = {
  getTree: () => request<OrgTreeResponse>('/organization/tree'),
}
