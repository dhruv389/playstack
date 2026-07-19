import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Calendar, Briefcase, Building2, IndianRupee,
  Pencil, Trash2, ArrowLeft, ChevronRight, Users2,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge, statusTone, roleTone } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmployeeForm, type EmployeeFormData } from '../components/employees/EmployeeForm';
import { useEmployees } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, getDirectReports } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { employees, activeEmployees, updateEmployee, softDeleteEmployee } = useEmployees();

  const employee = employees.find((e) => e.id === id);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!employee) {
    return (
      <DashboardLayout title="Employee not found">
        <Card>
          <CardBody className="text-center py-16">
            <p className="text-sm text-secondary">This employee record doesn't exist or was removed.</p>
            <Button variant="secondary" className="mt-4" onClick={() => navigate('/employees')}>
              Back to employees
            </Button>
          </CardBody>
        </Card>
      </DashboardLayout>
    );
  }

  const manager = employees.find((e) => e.id === employee.reportingManagerId);
  const reports = getDirectReports(activeEmployees, employee.id);

  const isSuperAdmin = user?.role === 'Super Admin';
  const isHR = user?.role === 'HR Manager';
  const isSelf = user?.employeeRecordId === employee.id;
  const canEdit = isSuperAdmin || isHR || isSelf;
  const canDelete = isSuperAdmin;

  const handleSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    updateEmployee(employee.id, isSelf && !isSuperAdmin && !isHR ? {
      phone: data.phone,
      address: data.address,
      profileImage: data.profileImage,
    } : data);
    toast.success('Profile updated');
    setIsSubmitting(false);
    setFormOpen(false);
  };

  const handleDelete = () => {
    softDeleteEmployee(employee.id);
    toast.success(`${employee.name} moved to deleted`);
    navigate('/employees');
  };

  const infoItems = [
    { icon: <Mail size={15} />, label: 'Email', value: employee.email },
    { icon: <Phone size={15} />, label: 'Phone', value: employee.phone },
    { icon: <MapPin size={15} />, label: 'Address', value: employee.address || 'Not provided' },
    { icon: <Calendar size={15} />, label: 'Joined', value: formatDate(employee.joiningDate) },
    { icon: <Briefcase size={15} />, label: 'Designation', value: employee.designation },
    { icon: <Building2 size={15} />, label: 'Department', value: employee.department },
    ...(isSuperAdmin || isHR || isSelf
      ? [{ icon: <IndianRupee size={15} />, label: 'Annual salary', value: formatCurrency(employee.salary) }]
      : []),
  ];

  return (
    <DashboardLayout title="Employee Profile">
      <button
        onClick={() => navigate('/employees')}
        className="mb-4 flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-primary"
      >
        <ArrowLeft size={14} /> Back to employees
      </button>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <CardBody className="flex flex-col items-center text-center">
            <Avatar src={employee.profileImage} name={employee.name} size="xl" status={employee.status} />
            <h2 className="mt-4 font-display text-lg font-semibold text-primary">{employee.name}</h2>
            <p className="text-sm text-secondary">{employee.designation}</p>
            <p className="mt-0.5 font-mono-num text-xs text-tertiary">{employee.employeeId}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Badge tone={statusTone(employee.status)} dot>{employee.status}</Badge>
              <Badge tone={roleTone(employee.role)}>{employee.role}</Badge>
            </div>

            {manager && (
              <Link
                to={`/employees/${manager.id}`}
                className="mt-5 flex w-full items-center gap-2.5 rounded-xl border border-subtle bg-surface-2 px-3.5 py-2.5 text-left hover:border-accent-500/40"
              >
                <Avatar src={manager.profileImage} name={manager.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wide text-tertiary">Reports to</p>
                  <p className="truncate text-sm font-medium text-primary">{manager.name}</p>
                </div>
                <ChevronRight size={14} className="text-tertiary" />
              </Link>
            )}

            {(canEdit || canDelete) && (
              <div className="mt-5 flex w-full gap-2">
                {canEdit && (
                  <Button variant="secondary" size="sm" fullWidth icon={<Pencil size={14} />} onClick={() => setFormOpen(true)}>
                    Edit
                  </Button>
                )}
                {canDelete && !isSelf && (
                  <Button variant="danger" size="sm" fullWidth icon={<Trash2 size={14} />} onClick={() => setDeleteOpen(true)}>
                    Delete
                  </Button>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Details + reports */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="font-display text-sm font-semibold text-primary">Contact & role details</h3>
            </CardHeader>
            <CardBody>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {infoItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-tertiary">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs text-tertiary">{item.label}</dt>
                      <dd className="truncate text-sm font-medium text-primary">{item.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users2 size={16} className="text-tertiary" />
                <h3 className="font-display text-sm font-semibold text-primary">
                  Direct reports ({reports.length})
                </h3>
              </div>
            </CardHeader>
            <CardBody className="!p-2">
              {reports.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-secondary">No direct reports.</p>
              ) : (
                <ul>
                  {reports.map((r) => (
                    <li key={r.id}>
                      <Link
                        to={`/employees/${r.id}`}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-surface-2"
                      >
                        <Avatar src={r.profileImage} name={r.name} size="sm" status={r.status} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-primary">{r.name}</p>
                          <p className="truncate text-xs text-secondary">{r.designation}</p>
                        </div>
                        <ChevronRight size={14} className="text-tertiary" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title="Edit employee"
        description={`Update ${employee.name}'s record`}
        size="lg"
      >
        <EmployeeForm
          initial={employee}
          managers={activeEmployees}
          mode={isSuperAdmin || isHR ? 'full' : 'self'}
          currentUserRole={user?.role ?? 'Employee'}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title={`Delete ${employee.name}?`}
        description="This is a soft delete — the record can be restored later from the Deleted tab."
        confirmLabel="Delete employee"
      />
    </DashboardLayout>
  );
}
