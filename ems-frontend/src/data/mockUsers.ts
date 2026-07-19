import type { AuthUser } from '../types';

export interface DemoAccount {
  email: string;
  password: string;
  user: AuthUser;
}

export const demoAccounts: DemoAccount[] = [
  {
    email: 'aarav.sharma@orbit.io',
    password: 'admin123',
    user: {
      id: 'user-001',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@orbit.io',
      role: 'Super Admin',
      profileImage: 'https://i.pravatar.cc/150?img=12',
      employeeRecordId: 'emp-001',
    },
  },
  {
    email: 'priya.nair@orbit.io',
    password: 'hr123',
    user: {
      id: 'user-002',
      name: 'Priya Nair',
      email: 'priya.nair@orbit.io',
      role: 'HR Manager',
      profileImage: 'https://i.pravatar.cc/150?img=47',
      employeeRecordId: 'emp-002',
    },
  },
  {
    email: 'karan.joshi@orbit.io',
    password: 'emp123',
    user: {
      id: 'user-016',
      name: 'Karan Joshi',
      email: 'karan.joshi@orbit.io',
      role: 'Employee',
      profileImage: 'https://i.pravatar.cc/150?img=19',
      employeeRecordId: 'emp-016',
    },
  },
];
