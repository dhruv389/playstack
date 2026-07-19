import Papa from 'papaparse';
import type { Employee } from '../types';

export interface CSVRow {
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: string;
  joiningDate: string;
  status: string;
}

export const parseCSV = (file: File): Promise<CSVRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err: Error) => reject(err),
    });
  });
};

export const downloadCSVTemplate = () => {
  const headers = 'name,email,phone,department,designation,salary,joiningDate,status\n';
  const sample = 'Jane Doe,jane.doe@orbit.io,+91 98765 43210,Engineering,Associate,1200000,2024-01-15,Active\n';
  const blob = new Blob([headers + sample], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'employee_import_template.csv';
  a.click();
  URL.revokeObjectURL(url);
};

export const exportEmployeesToCSV = (employees: Employee[]) => {
  const csv = Papa.unparse(
    employees.map((e) => ({
      employeeId: e.employeeId,
      name: e.name,
      email: e.email,
      phone: e.phone,
      department: e.department,
      designation: e.designation,
      salary: e.salary,
      joiningDate: e.joiningDate,
      status: e.status,
      role: e.role,
    }))
  );
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `employees_export_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
