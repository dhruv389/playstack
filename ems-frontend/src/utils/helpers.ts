import type { Employee } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const initials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const nextEmployeeId = (employees: Employee[]): string => {
  const nums = employees
    .map((e) => parseInt(e.employeeId.replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 1000;
  return `ORB-${max + 1}`;
};

// Detects if setting `candidateManagerId` as the manager of `employeeId`
// would create a circular reporting chain.
export const wouldCreateCycle = (
  employees: Employee[],
  employeeId: string,
  candidateManagerId: string | null
): boolean => {
  if (!candidateManagerId) return false;
  if (candidateManagerId === employeeId) return true;
  let current: string | null = candidateManagerId;
  const visited = new Set<string>();
  while (current) {
    if (current === employeeId) return true;
    if (visited.has(current)) break;
    visited.add(current);
    const manager: Employee | undefined = employees.find((e) => e.id === current);
    current = manager?.reportingManagerId ?? null;
  }
  return false;
};

export const getDirectReports = (employees: Employee[], managerId: string): Employee[] => {
  return employees.filter((e) => e.reportingManagerId === managerId && !e.isDeleted);
};

export const getAllReportees = (employees: Employee[], managerId: string): Employee[] => {
  const direct = getDirectReports(employees, managerId);
  let all = [...direct];
  direct.forEach((d) => {
    all = all.concat(getAllReportees(employees, d.id));
  });
  return all;
};
