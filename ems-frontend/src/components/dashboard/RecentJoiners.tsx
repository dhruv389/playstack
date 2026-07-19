import type { Employee } from '../../types';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { formatDate } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export function RecentJoiners({ employees }: { employees: Employee[] }) {
  const recent = [...employees]
    .sort((a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="font-display text-sm font-semibold text-primary">Recent joiners</h3>
          <p className="text-xs text-secondary mt-0.5">Newest additions to the team</p>
        </div>
        <Link to="/employees" className="text-xs font-medium text-accent-500 hover:text-accent-600">
          View all
        </Link>
      </CardHeader>
      <CardBody className="!p-2">
        <ul>
          {recent.map((e) => (
            <li key={e.id}>
              <Link
                to={`/employees/${e.id}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-surface-2 transition-colors"
              >
                <Avatar src={e.profileImage} name={e.name} size="sm" status={e.status} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-primary">{e.name}</p>
                  <p className="truncate text-xs text-secondary">{e.designation} · {e.department}</p>
                </div>
                <span className="shrink-0 text-xs text-tertiary">{formatDate(e.joiningDate)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
