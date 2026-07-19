import { useState } from 'react';
import { Search } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { OrgChart } from '../components/organization/OrgChart';
import { useEmployees } from '../context/EmployeeContext';

export default function OrganizationPage() {
  const { activeEmployees } = useEmployees();
  const [search, setSearch] = useState('');

  const filtered = search
    ? activeEmployees.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.department.toLowerCase().includes(search.toLowerCase())
      )
    : activeEmployees;

  return (
    <DashboardLayout title="Organization">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-primary">Reporting hierarchy</h2>
          <p className="mt-1 text-sm text-secondary">Explore how your organization is structured, top to bottom.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tertiary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people or teams…"
            className="w-full rounded-lg border border-default bg-surface py-2.5 pl-10 pr-3.5 text-sm text-primary placeholder:text-tertiary focus-ring outline-none focus:border-accent-500"
          />
        </div>
      </div>

      <OrgChart employees={filtered} />
    </DashboardLayout>
  );
}
