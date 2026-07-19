import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Employee } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge, roleTone } from '../ui/Badge';
import { getDirectReports } from '../../utils/helpers';
import { cn } from '../../utils/helpers';

export function OrgTreeNode({
  employee,
  allEmployees,
  depth = 0,
  defaultExpanded = false,
}: {
  employee: Employee;
  allEmployees: Employee[];
  depth?: number;
  defaultExpanded?: boolean;
}) {
  const reports = getDirectReports(allEmployees, employee.id);
  const [expanded, setExpanded] = useState(defaultExpanded || depth < 1);
  const hasReports = reports.length > 0;

  return (
    <div className={cn(depth > 0 && 'ml-6 border-l border-subtle pl-5')}>
      <div className="group flex items-center gap-2 py-1.5">
        {hasReports ? (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="rounded-md p-0.5 text-tertiary hover:bg-surface-2 hover:text-primary"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            <ChevronRight size={16} className={cn('transition-transform', expanded && 'rotate-90')} />
          </button>
        ) : (
          <span className="w-[22px]" />
        )}

        <Link
          to={`/employees/${employee.id}`}
          className="flex flex-1 items-center gap-3 rounded-xl border border-default bg-surface px-3.5 py-2.5 transition-colors hover:bg-surface-2 hover:border-accent-500/40"
        >
          <Avatar src={employee.profileImage} name={employee.name} size="sm" status={employee.status} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-primary">{employee.name}</p>
            <p className="truncate text-xs text-tertiary">{employee.designation} · {employee.department}</p>
          </div>
          <Badge tone={roleTone(employee.role)} className="hidden sm:inline-flex">
            {employee.role}
          </Badge>
          {hasReports && (
            <span className="shrink-0 rounded-full bg-surface-3 px-2 py-0.5 text-xs font-medium text-secondary">
              {reports.length} report{reports.length > 1 ? 's' : ''}
            </span>
          )}
        </Link>
      </div>

      {expanded && hasReports && (
        <div>
          {reports.map((child) => (
            <OrgTreeNode key={child.id} employee={child} allEmployees={allEmployees} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
