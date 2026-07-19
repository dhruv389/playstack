import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { employeeApi, type EmployeeShape } from '../lib/api'
import type { Employee } from '../types'

// ─── Shape adapter ────────────────────────────────────────────────────────────
// The backend returns EmployeeShape (with _id). The frontend uses Employee (with id).
// Both have `id` due to the virtual — but we normalize just to be safe.
const toEmployee = (e: EmployeeShape): Employee => ({
  id: e.id || e._id,
  employeeId: e.employeeId,
  name: e.name,
  email: e.email,
  phone: e.phone,
  department: e.department as Employee['department'],
  designation: e.designation as Employee['designation'],
  salary: e.salary,
  joiningDate: e.joiningDate,
  status: e.status,
  role: e.role,
  reportingManagerId: e.reportingManagerId,
  profileImage: e.profileImage,
  address: e.address,
  isDeleted: e.isDeleted ?? false,
})

// ─── Context types ────────────────────────────────────────────────────────────

interface EmployeeContextValue {
  employees: Employee[]          // all (including soft-deleted)
  activeEmployees: Employee[]    // isDeleted = false only
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  addEmployee: (data: Omit<Employee, 'id' | 'employeeId' | 'isDeleted'>) => Promise<Employee>
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>
  softDeleteEmployee: (id: string) => Promise<void>
  restoreEmployee: (id: string) => Promise<void>
  hardDeleteEmployee: (id: string) => void          // local remove only (not in backend)
  assignManager: (
    employeeId: string,
    managerId: string | null
  ) => Promise<{ success: boolean; error?: string }>
  bulkImport: (rows: Partial<Employee>[]) => Promise<{ imported: number; skipped: number }>
  resetData: () => void
}

const EmployeeContext = createContext<EmployeeContextValue | undefined>(undefined)

// ─── Provider ────────────────────────────────────────────────────────────────

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [allEmployees, setAllEmployees] = useState<Employee[]>([])
  const [deletedEmployees, setDeletedEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [activeRes, deletedRes] = await Promise.all([
        employeeApi.getAll({ limit: 200, deleted: false }),
        employeeApi.getAll({ limit: 200, deleted: true }),
      ])
      setAllEmployees(activeRes.data.map(toEmployee))
      setDeletedEmployees(deletedRes.data.map(toEmployee))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load employees'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Merged list: active + deleted (mirrors old localStorage shape)
  const employees: Employee[] = [
    ...allEmployees,
    ...deletedEmployees.map((e) => ({ ...e, isDeleted: true })),
  ]

  const activeEmployees = allEmployees

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const addEmployee = async (
    data: Omit<Employee, 'id' | 'employeeId' | 'isDeleted'>
  ): Promise<Employee> => {
    const res = await employeeApi.create(data as Partial<EmployeeShape>)
    const emp = toEmployee(res.data)
    setAllEmployees((prev) => [emp, ...prev])
    return emp
  }

  const updateEmployee = async (id: string, data: Partial<Employee>) => {
    const res = await employeeApi.update(id, data as Partial<EmployeeShape>)
    const updated = toEmployee(res.data)

    // Update in whichever list it lives
    setAllEmployees((prev) => prev.map((e) => (e.id === id ? updated : e)))
    setDeletedEmployees((prev) => prev.map((e) => (e.id === id ? updated : e)))
  }

  const softDeleteEmployee = async (id: string) => {
    await employeeApi.softDelete(id)
    const emp = allEmployees.find((e) => e.id === id)
    if (emp) {
      setAllEmployees((prev) => prev.filter((e) => e.id !== id))
      setDeletedEmployees((prev) => [{ ...emp, isDeleted: true, status: 'Inactive' }, ...prev])
    }
  }

  const restoreEmployee = async (id: string) => {
    await employeeApi.restore(id)
    const emp = deletedEmployees.find((e) => e.id === id)
    if (emp) {
      setDeletedEmployees((prev) => prev.filter((e) => e.id !== id))
      setAllEmployees((prev) => [{ ...emp, isDeleted: false, status: 'Active' }, ...prev])
    }
  }

  // Hard delete is local only — removes from UI state
  const hardDeleteEmployee = (id: string) => {
    setAllEmployees((prev) => prev.filter((e) => e.id !== id))
    setDeletedEmployees((prev) => prev.filter((e) => e.id !== id))
  }

  const assignManager = async (
    employeeId: string,
    managerId: string | null
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await employeeApi.assignManager(employeeId, managerId)
      const updated = toEmployee(res.data)
      setAllEmployees((prev) => prev.map((e) => (e.id === employeeId ? updated : e)))
      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to assign manager'
      return { success: false, error: message }
    }
  }

  const bulkImport = async (
    rows: Partial<Employee>[]
  ): Promise<{ imported: number; skipped: number }> => {
    const res = await employeeApi.bulkImport(rows as Partial<EmployeeShape>[])
    // Refresh the full list after import
    await fetchAll()
    return { imported: res.imported, skipped: res.skipped }
  }

  const resetData = () => {
    // Re-fetch from the DB instead of clearing
    fetchAll()
  }

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        activeEmployees,
        isLoading,
        error,
        refresh: fetchAll,
        addEmployee,
        updateEmployee,
        softDeleteEmployee,
        restoreEmployee,
        hardDeleteEmployee,
        assignManager,
        bulkImport,
        resetData,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  )
}

export function useEmployees() {
  const ctx = useContext(EmployeeContext)
  if (!ctx) throw new Error('useEmployees must be used within EmployeeProvider')
  return ctx
}
