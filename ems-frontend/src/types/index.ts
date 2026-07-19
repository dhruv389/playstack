export type Role = 'Super Admin' | 'HR Manager' | 'Employee';

export type EmployeeStatus = 'Active' | 'Inactive';

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string; // ISO date
  status: EmployeeStatus;
  role: Role;
  reportingManagerId: string | null;
  profileImage: string;
  isDeleted?: boolean;
  address?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  profileImage: string;
  employeeRecordId: string | null;
}

export interface FilterState {
  search: string;
  department: string;
  role: string;
  status: string;
  sortBy: 'name' | 'joiningDate' | 'salary';
  sortDir: 'asc' | 'desc';
}

export interface DashboardStats {
  total: number;
  active: number;
  inactive: number;
  departments: number;
}

export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Customer Support',
] as const;

export const DESIGNATIONS = [
  'Intern',
  'Associate',
  'Senior Associate',
  'Team Lead',
  'Manager',
  'Senior Manager',
  'Director',
  'VP',
  'C-Level',
] as const;
