import { useMemo, useState } from 'react';
import { Plus, Upload, Download, Users, Trash2 } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmployeeFilters } from '../components/employees/EmployeeFilters';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { EmployeeForm, type EmployeeFormData } from '../components/employees/EmployeeForm';
import { CSVImportModal } from '../components/employees/CSVImportModal';
import { Pagination } from '../components/ui/Pagination';
import { useEmployees } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import type { Employee, FilterState } from '../types';
import toast from 'react-hot-toast';
import { exportEmployeesToCSV } from '../utils/csv';
import { cn } from '../utils/helpers';

const PAGE_SIZE = 8;

const defaultFilters: FilterState = {
  search: '',
  department: '',
  role: '',
  status: '',
  sortBy: 'name',
  sortDir: 'asc',
};

export default function EmployeesPage() {
  const { user } = useAuth();
  const { employees, activeEmployees, addEmployee, updateEmployee, softDeleteEmployee, restoreEmployee } =
    useEmployees();

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const debouncedSearch = useDebounce(filters.search, 250);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'active' | 'deleted'>('active');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSuperAdmin = user?.role === 'Super Admin';
  const canCreate = isSuperAdmin || user?.role === 'HR Manager';
  const canDelete = isSuperAdmin;

  const sourceList = view === 'active' ? activeEmployees : employees.filter((e) => e.isDeleted);

  const filtered = useMemo(() => {
    let list = sourceList.filter((e) => {
      const matchesSearch =
        !debouncedSearch ||
        e.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        e.email.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesDept = !filters.department || e.department === filters.department;
      const matchesRole = !filters.role || e.role === filters.role;
      const matchesStatus = !filters.status || e.status === filters.status;
      return matchesSearch && matchesDept && matchesRole && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (filters.sortBy === 'name') cmp = a.name.localeCompare(b.name);
      if (filters.sortBy === 'joiningDate') cmp = new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime();
      if (filters.sortBy === 'salary') cmp = a.salary - b.salary;
      return filters.sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [sourceList, debouncedSearch, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (f: FilterState) => {
    setFilters(f);
    setPage(1);
  };

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setEditing(emp);
    setFormOpen(true);
  };

  const handleSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    if (editing) {
      updateEmployee(editing.id, data);
      toast.success('Employee updated');
    } else {
      addEmployee(data);
      toast.success('Employee added');
    }
    setIsSubmitting(false);
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    softDeleteEmployee(deleteTarget.id);
    toast.success(`${deleteTarget.name} moved to deleted`);
    setDeleteTarget(null);
  };

  const handleRestore = (emp: Employee) => {
    restoreEmployee(emp.id);
    toast.success(`${emp.name} restored`);
  };

  return (
    <DashboardLayout title="Employees">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-primary">All employees</h2>
          <p className="mt-1 text-sm text-secondary">{activeEmployees.length} people across your organization</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" icon={<Download size={15} />} onClick={() => exportEmployeesToCSV(filtered)}>
            Export
          </Button>
          {canCreate && (
            <>
              <Button variant="secondary" size="sm" icon={<Upload size={15} />} onClick={() => setImportOpen(true)}>
                Import CSV
              </Button>
              <Button size="sm" icon={<Plus size={15} />} onClick={openCreate}>
                Add employee
              </Button>
            </>
          )}
        </div>
      </div>

      {canDelete && (
        <div className="mb-4 inline-flex rounded-lg border border-default bg-surface p-1">
          <button
            onClick={() => { setView('active'); setPage(1); }}
            className={cn(
              'rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors',
              view === 'active' ? 'bg-accent-500 text-white' : 'text-secondary hover:text-primary'
            )}
          >
            Active
          </button>
          <button
            onClick={() => { setView('deleted'); setPage(1); }}
            className={cn(
              'rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5',
              view === 'deleted' ? 'bg-accent-500 text-white' : 'text-secondary hover:text-primary'
            )}
          >
            <Trash2 size={12} />
            Deleted ({employees.filter((e) => e.isDeleted).length})
          </button>
        </div>
      )}

      <div className="mb-4">
        <EmployeeFilters filters={filters} onChange={handleFilterChange} />
      </div>

      <Card>
        <EmployeeTable
          employees={paginated}
          canEdit={canCreate && view === 'active'}
          canDelete={canDelete && view === 'active'}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          onRestore={handleRestore}
          showDeleted={view === 'deleted'}
        />
        {filtered.length > 0 && (
          <div className="border-t border-subtle px-3">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
          </div>
        )}
      </Card>

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit employee' : 'Add new employee'}
        description={editing ? `Update ${editing.name}'s record` : 'Create a new employee record'}
        size="lg"
      >
        <EmployeeForm
          initial={editing}
          managers={activeEmployees}
          mode="full"
          currentUserRole={user?.role ?? 'Employee'}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleteTarget?.name}?`}
        description="This is a soft delete — the record moves to Deleted and can be restored anytime."
        confirmLabel="Delete employee"
      />

      <CSVImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} />

      {activeEmployees.length === 0 && (
        <div className="mt-6">
          <Users className="mx-auto text-tertiary" />
        </div>
      )}
    </DashboardLayout>
  );
}
