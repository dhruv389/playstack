import { useState } from 'react';
import type { Employee, Role } from '../../types';
import { DEPARTMENTS, DESIGNATIONS } from '../../types';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import {
  validateEmail,
  validatePhone,
  validateRequired,
  validateSalary,
  validateDate,
  type ValidationErrors,
} from '../../utils/validation';

export type EmployeeFormData = Omit<Employee, 'id' | 'employeeId' | 'isDeleted'>;

interface Props {
  initial?: Employee;
  managers: Employee[];
  mode: 'full' | 'self';
  currentUserRole: Role;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const emptyForm: EmployeeFormData = {
  name: '',
  email: '',
  phone: '',
  department: 'Engineering',
  designation: 'Associate',
  salary: 0,
  joiningDate: new Date().toISOString().slice(0, 10),
  status: 'Active',
  role: 'Employee',
  reportingManagerId: null,
  profileImage: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 60) + 1}`,
  address: '',
};

export function EmployeeForm({ initial, managers, mode, currentUserRole, onSubmit, onCancel, isSubmitting }: Props) {
  const [form, setForm] = useState<EmployeeFormData>(
    initial
      ? {
          name: initial.name,
          email: initial.email,
          phone: initial.phone,
          department: initial.department,
          designation: initial.designation,
          salary: initial.salary,
          joiningDate: initial.joiningDate,
          status: initial.status,
          role: initial.role,
          reportingManagerId: initial.reportingManagerId,
          profileImage: initial.profileImage,
          address: initial.address ?? '',
        }
      : emptyForm
  );
  const [errors, setErrors] = useState<ValidationErrors>({});

  const isSelfMode = mode === 'self';
  const canAssignSuperAdmin = currentUserRole === 'Super Admin';

  const set = <K extends keyof EmployeeFormData>(key: K, value: EmployeeFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = (): boolean => {
    const next: ValidationErrors = {
      name: validateRequired(form.name, 'Name'),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
    };
    if (!isSelfMode) {
      next.salary = validateSalary(form.salary);
      next.joiningDate = validateDate(form.joiningDate);
    }
    const filtered = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    setErrors(filtered);
    return Object.keys(filtered).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const managerOptions = managers
    .filter((m) => m.id !== initial?.id)
    .map((m) => ({ value: m.id, label: `${m.name} — ${m.designation}` }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <img
          src={form.profileImage}
          alt="Profile preview"
          className="h-16 w-16 rounded-full object-cover ring-2 ring-default"
        />
        <div className="flex-1">
          <Input
            label="Profile image URL"
            value={form.profileImage}
            onChange={(e) => set('profileImage', e.target.value)}
            placeholder="https://…"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Full name"
          required
          value={form.name}
          error={errors.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Jane Doe"
        />
        <Input
          label="Email address"
          required
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="jane.doe@orbit.io"
          disabled={isSelfMode}
        />
        <Input
          label="Phone number"
          required
          value={form.phone}
          error={errors.phone}
          onChange={(e) => set('phone', e.target.value)}
          placeholder="+91 98765 43210"
        />
        <Input
          label="Address"
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
          placeholder="City, Country"
        />
      </div>

      {!isSelfMode && (
        <>
          <div className="h-px bg-subtle" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Department"
              required
              value={form.department}
              onChange={(e) => set('department', e.target.value)}
              options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
            />
            <Select
              label="Designation"
              required
              value={form.designation}
              onChange={(e) => set('designation', e.target.value)}
              options={DESIGNATIONS.map((d) => ({ value: d, label: d }))}
            />
            <Input
              label="Salary (₹ / year)"
              required
              type="number"
              min={0}
              value={form.salary}
              error={errors.salary}
              onChange={(e) => set('salary', Number(e.target.value))}
            />
            <Input
              label="Joining date"
              required
              type="date"
              value={form.joiningDate}
              error={errors.joiningDate}
              onChange={(e) => set('joiningDate', e.target.value)}
            />
            <Select
              label="Status"
              required
              value={form.status}
              onChange={(e) => set('status', e.target.value as Employee['status'])}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
            />
            <Select
              label="System role"
              required
              value={form.role}
              onChange={(e) => set('role', e.target.value as Role)}
              options={[
                ...(canAssignSuperAdmin ? [{ value: 'Super Admin', label: 'Super Admin' }] : []),
                { value: 'HR Manager', label: 'HR Manager' },
                { value: 'Employee', label: 'Employee' },
              ]}
              hint={!canAssignSuperAdmin ? 'Only Super Admins can assign the Super Admin role' : undefined}
            />
            <Select
              label="Reporting manager"
              value={form.reportingManagerId ?? ''}
              onChange={(e) => set('reportingManagerId', e.target.value || null)}
              options={managerOptions}
              placeholder="No manager (top level)"
              wrapperClassName="sm:col-span-2"
            />
          </div>
        </>
      )}

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initial ? 'Save changes' : 'Add employee'}
        </Button>
      </div>
    </form>
  );
}
