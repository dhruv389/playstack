import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import type { Employee } from '../../types';
import { Card, CardHeader, CardBody } from '../ui/Card';

export function StatusChart({ employees }: { employees: Employee[] }) {
  const { theme } = useTheme();
  const active = employees.filter((e) => e.status === 'Active').length;
  const inactive = employees.filter((e) => e.status === 'Inactive').length;
  const data = [
    { name: 'Active', value: active, color: '#10b981' },
    { name: 'Inactive', value: inactive, color: '#f43f5e' },
  ];
  const total = active + inactive;

  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="font-display text-sm font-semibold text-primary">Workforce status</h3>
          <p className="text-xs text-secondary mt-0.5">Active vs inactive employees</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="relative">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                strokeWidth={0}
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#121623' : '#ffffff',
                  border: `1px solid ${theme === 'dark' ? '#1e2536' : '#e4e7f0'}`,
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-semibold text-primary font-mono-num">{total}</span>
            <span className="text-xs text-secondary">Total</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-center gap-6">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-secondary">
                {d.name} <span className="font-medium text-primary">({d.value})</span>
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
