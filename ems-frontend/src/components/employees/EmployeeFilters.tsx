import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import type { FilterState } from '../../types';
import { DEPARTMENTS } from '../../types';
import { cn } from '../../utils/helpers';

export function EmployeeFilters({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}) {
  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const activeFilterCount = [filters.department, filters.role, filters.status].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-default bg-surface p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tertiary" />
          <input
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-lg border border-default bg-surface py-2.5 pl-10 pr-3.5 text-sm text-primary placeholder:text-tertiary focus-ring outline-none focus:border-accent-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-secondary">
          <SlidersHorizontal size={14} />
          {activeFilterCount > 0 ? `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active` : 'Filters'}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filters.department}
          onChange={(e) => update('department', e.target.value)}
          className={cn(
            'rounded-lg border bg-surface px-3 py-2 text-xs font-medium cursor-pointer focus-ring outline-none',
            filters.department ? 'border-accent-500 text-accent-500' : 'border-default text-secondary'
          )}
        >
          <option value="">All departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={filters.role}
          onChange={(e) => update('role', e.target.value)}
          className={cn(
            'rounded-lg border bg-surface px-3 py-2 text-xs font-medium cursor-pointer focus-ring outline-none',
            filters.role ? 'border-accent-500 text-accent-500' : 'border-default text-secondary'
          )}
        >
          <option value="">All roles</option>
          <option value="Super Admin">Super Admin</option>
          <option value="HR Manager">HR Manager</option>
          <option value="Employee">Employee</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => update('status', e.target.value)}
          className={cn(
            'rounded-lg border bg-surface px-3 py-2 text-xs font-medium cursor-pointer focus-ring outline-none',
            filters.status ? 'border-accent-500 text-accent-500' : 'border-default text-secondary'
          )}
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div className="ml-auto flex items-center gap-1.5">
          <ArrowUpDown size={13} className="text-tertiary" />
          <select
            value={filters.sortBy}
            onChange={(e) => update('sortBy', e.target.value as FilterState['sortBy'])}
            className="rounded-lg border border-default bg-surface px-3 py-2 text-xs font-medium text-secondary cursor-pointer focus-ring outline-none"
          >
            <option value="name">Name</option>
            <option value="joiningDate">Joining date</option>
            <option value="salary">Salary</option>
          </select>
          <button
            onClick={() => update('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc')}
            className="rounded-lg border border-default px-2.5 py-2 text-xs font-medium text-secondary hover:bg-surface-2 focus-ring"
            title={filters.sortDir === 'asc' ? 'Ascending' : 'Descending'}
          >
            {filters.sortDir === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
    </div>
  );
}
