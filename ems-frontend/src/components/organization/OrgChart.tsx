import type { Employee } from '../../types';
import { OrgTreeNode } from './OrgTreeNode';
import { Card, CardBody } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Network } from 'lucide-react';

export function OrgChart({ employees }: { employees: Employee[] }) {
  const roots = employees.filter((e) => !e.reportingManagerId || !employees.some((m) => m.id === e.reportingManagerId));

  if (roots.length === 0) {
    return (
      <EmptyState
        icon={<Network size={22} />}
        title="No organization data"
        description="Add employees and assign reporting managers to see the hierarchy here."
      />
    );
  }

  return (
    <Card>
      <CardBody>
        <div className="flex flex-col gap-1">
          {roots.map((root) => (
            <OrgTreeNode key={root.id} employee={root} allEmployees={employees} defaultExpanded />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
