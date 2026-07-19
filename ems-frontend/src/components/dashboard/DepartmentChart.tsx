import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import type { Employee } from '../../types';
import { Card, CardHeader, CardBody } from '../ui/Card';

const COLORS = ['#7c5cff', '#9678ff', '#38bdf8', '#10b981', '#f5a524', '#f43f5e', '#b9a9ff', '#0ea5e9', '#34d399'];

export function DepartmentChart({ employees }: { employees: Employee[] }) {
  const { theme } = useTheme();
  const gridColor = theme === 'dark' ? '#1e2536' : '#e4e7f0';
  const textColor = theme === 'dark' ? '#8b93a9' : '#5c6479';

  const data = Object.entries(
    employees.reduce<Record<string, number>>((acc, e) => {
      acc[e.department] = (acc[e.department] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="font-display text-sm font-semibold text-primary">Headcount by department</h3>
          <p className="text-xs text-secondary mt-0.5">Active employees per team</p>
        </div>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="department"
              width={110}
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: theme === 'dark' ? 'rgba(124,92,255,0.06)' : 'rgba(124,92,255,0.06)' }}
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#121623' : '#ffffff',
                border: `1px solid ${gridColor}`,
                borderRadius: 12,
                fontSize: 12,
                color: textColor,
              }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
