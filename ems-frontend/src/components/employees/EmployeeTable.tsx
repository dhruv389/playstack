import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Eye, Pencil, Trash2, RotateCcw, Users } from 'lucide-react';
import type { Employee } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge, statusTone, roleTone } from '../ui/Badge';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { EmptyState } from '../ui/EmptyState';

interface Props {
  employees: Employee[];
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
  onRestore?: (emp: Employee) => void;
  showDeleted?: boolean;
}

function RowMenu({ emp, canEdit, canDelete, onEdit, onDelete, onRestore, showDeleted }: Props & { emp: Employee }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg p-1.5 text-tertiary hover:bg-surface-2 hover:text-primary focus-ring"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-1 w-40 animate-scale-in rounded-xl border border-default bg-surface p-1.5 shadow-xl">
          <Link
            to={`/employees/${emp.id}`}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-secondary hover:bg-surface-2 hover:text-primary"
          >
            <Eye size={15} /> View
          </Link>
          {canEdit && (
            <button
              onClick={() => { setOpen(false); onEdit(emp); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-secondary hover:bg-surface-2 hover:text-primary"
            >
              <Pencil size={15} /> Edit
            </button>
          )}
          {showDeleted && onRestore ? (
            <button
              onClick={() => { setOpen(false); onRestore(emp); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-success-500 hover:bg-success-500/10"
            >
              <RotateCcw size={15} /> Restore
            </button>
          ) : (
            canDelete && (
              <button
                onClick={() => { setOpen(false); onDelete(emp); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger-500 hover:bg-danger-500/10"
              >
                <Trash2 size={15} /> Delete
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export function EmployeeTable(props: Props) {
  const { employees } = props;

  if (employees.length === 0) {
    return (
      <EmptyState
        icon={<Users size={22} />}
        title="No employees found"
        description="Try adjusting your search or filters to find what you're looking for."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left">
        <thead>
          <tr className="border-b border-subtle">
            <th className="px-5 py-3 text-xs font-medium text-tertiary">Employee</th>
            <th className="px-5 py-3 text-xs font-medium text-tertiary">Department</th>
            <th className="px-5 py-3 text-xs font-medium text-tertiary">Designation</th>
            <th className="px-5 py-3 text-xs font-medium text-tertiary">Joined</th>
            <th className="px-5 py-3 text-xs font-medium text-tertiary">Salary</th>
            <th className="px-5 py-3 text-xs font-medium text-tertiary">Status</th>
            <th className="px-5 py-3 text-xs font-medium text-tertiary">Role</th>
            <th className="px-5 py-3 text-xs font-medium text-tertiary text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-b border-subtle last:border-0 hover:bg-surface-2/60 transition-colors">
              <td className="px-5 py-3">
                <Link to={`/employees/${emp.id}`} className="flex items-center gap-3 min-w-[200px]">
                  <Avatar src={emp.profileImage} name={emp.name} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-primary">{emp.name}</p>
                    <p className="truncate text-xs text-tertiary">{emp.email}</p>
                  </div>
                </Link>
              </td>
              <td className="px-5 py-3 text-sm text-secondary whitespace-nowrap">{emp.department}</td>
              <td className="px-5 py-3 text-sm text-secondary whitespace-nowrap">{emp.designation}</td>
              <td className="px-5 py-3 text-sm text-secondary whitespace-nowrap font-mono-num">{formatDate(emp.joiningDate)}</td>
              <td className="px-5 py-3 text-sm text-primary whitespace-nowrap font-mono-num">{formatCurrency(emp.salary)}</td>
              <td className="px-5 py-3">
                <Badge tone={statusTone(emp.status)} dot>{emp.status}</Badge>
              </td>
              <td className="px-5 py-3">
                <Badge tone={roleTone(emp.role)}>{emp.role}</Badge>
              </td>
              <td className="px-5 py-3 text-right">
                <RowMenu {...props} emp={emp} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
