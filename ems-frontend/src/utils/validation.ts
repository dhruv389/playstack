export interface ValidationErrors {
  [key: string]: string;
}

export const validateEmail = (email: string): string => {
  if (!email.trim()) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Enter a valid email address';
  return '';
};

export const validatePhone = (phone: string): string => {
  if (!phone.trim()) return 'Phone number is required';
  const re = /^[+]?[\d\s-]{7,15}$/;
  if (!re.test(phone)) return 'Enter a valid phone number';
  return '';
};

export const validateRequired = (value: string, label: string): string => {
  if (!value || !value.trim()) return `${label} is required`;
  return '';
};

export const validateSalary = (salary: number | string): string => {
  const num = Number(salary);
  if (salary === '' || salary === null || salary === undefined) return 'Salary is required';
  if (Number.isNaN(num)) return 'Salary must be a number';
  if (num <= 0) return 'Salary must be greater than 0';
  if (num > 100000000) return 'Salary looks unrealistic — check the value';
  return '';
};

export const validateDate = (date: string): string => {
  if (!date) return 'Joining date is required';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return 'Enter a valid date';
  if (d > new Date()) return 'Joining date cannot be in the future';
  return '';
};
