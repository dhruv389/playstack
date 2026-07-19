import { Users, UserCheck, UserX, Building2 } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { DepartmentChart } from '../components/dashboard/DepartmentChart';
import { StatusChart } from '../components/dashboard/StatusChart';
import { RecentJoiners } from '../components/dashboard/RecentJoiners';
import { useEmployees } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { activeEmployees } = useEmployees();
  const { user } = useAuth();

  const total = activeEmployees.length;
  const active = activeEmployees.filter((e) => e.status === 'Active').length;
  const inactive = activeEmployees.filter((e) => e.status === 'Inactive').length;
  const departments = new Set(activeEmployees.map((e) => e.department)).size;

  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-primary">
          {user?.role === 'Employee' ? `Welcome, ${user.name.split(' ')[0]}` : 'Overview'}
        </h2>
        <p className="mt-1 text-sm text-secondary">Here's what's happening across your organization today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total employees" value={total} icon={<Users size={20} />} tone="accent" />
        <StatCard label="Active employees" value={active} icon={<UserCheck size={20} />} tone="success" />
        <StatCard label="Inactive employees" value={inactive} icon={<UserX size={20} />} tone="danger" />
        <StatCard label="Departments" value={departments} icon={<Building2 size={20} />} tone="info" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DepartmentChart employees={activeEmployees} />
        </div>
        <StatusChart employees={activeEmployees} />
      </div>

      <div className="mt-4">
        <RecentJoiners employees={activeEmployees} />
      </div>
    </DashboardLayout>
  );
}
