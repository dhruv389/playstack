import mongoose from 'mongoose'
import Employee from '../models/Employee.js'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

// Utility — check for circular reporting chain
const wouldCreateCycle = async (employeeId, candidateManagerId) => {
  if (!candidateManagerId) return false
  if (candidateManagerId.toString() === employeeId.toString()) return true

  let current = candidateManagerId
  const visited = new Set()

  while (current) {
    if (current.toString() === employeeId.toString()) return true
    if (visited.has(current.toString())) break
    visited.add(current.toString())
    const mgr = await Employee.findById(current).select('reportingManagerId')
    current = mgr?.reportingManagerId ?? null
  }
  return false
}

// @route  GET /api/employees
// @desc   Get all employees with filtering, sorting, pagination
// @access Private
export const getEmployees = async (req, res) => {
  try {
    const {
      search,
      department,
      role,
      status,
      sortBy = 'name',
      sortDir = 'asc',
      page = 1,
      limit = 50,
      deleted = 'false',
    } = req.query

    const query = {}

    // Soft delete filter
    query.isDeleted = deleted === 'true'

    // RBAC: employees can only see themselves
    if (req.user.role === 'Employee') {
      query._id = req.user.employeeRecordId
    }

    // Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    // Filters
    if (department) query.department = department
    if (role) query.role = role
    if (status) query.status = status

    // Sort
    const sortMap = {
      name: 'name',
      joiningDate: 'joiningDate',
      salary: 'salary',
    }
    const sortField = sortMap[sortBy] || 'name'
    const sortOrder = sortDir === 'desc' ? -1 : 1

    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(100, parseInt(limit))
    const skip = (pageNum - 1) * limitNum

    const [employees, total] = await Promise.all([
      Employee.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean({ virtuals: true }),
      Employee.countDocuments(query),
    ])

    // Normalize IDs to strings
    const normalized = employees.map((e) => ({
      ...e,
      id: e._id.toString(),
      reportingManagerId: e.reportingManagerId ? e.reportingManagerId.toString() : null,
    }))

    res.status(200).json({
      success: true,
      data: normalized,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  } catch (err) {
    console.error('getEmployees error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// @route  GET /api/employees/:id
// @desc   Get single employee
// @access Private
export const getEmployee = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' })
    }

    const employee = await Employee.findById(id).lean({ virtuals: true })

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' })
    }

    // RBAC: Employee can only view their own record
    if (
      req.user.role === 'Employee' &&
      req.user.employeeRecordId?.toString() !== employee._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    const normalized = {
      ...employee,
      id: employee._id.toString(),
      reportingManagerId: employee.reportingManagerId ? employee.reportingManagerId.toString() : null,
    }

    res.status(200).json({ success: true, data: normalized })
  } catch (err) {
    console.error('getEmployee error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// @route  POST /api/employees
// @desc   Create employee
// @access Private — Super Admin, HR Manager
export const createEmployee = async (req, res) => {
  try {
    const {
      name, email, phone, department, designation,
      salary, joiningDate, status, role, reportingManagerId,
      profileImage, address,
    } = req.body

    // HR Manager cannot create Super Admin accounts
    if (req.user.role === 'HR Manager' && role === 'Super Admin') {
      return res.status(403).json({ success: false, message: 'HR Managers cannot create Super Admin accounts' })
    }

    // Check duplicate email
    const exists = await Employee.findOne({ email: email?.toLowerCase().trim() })
    if (exists) {
      return res.status(400).json({ success: false, message: 'An employee with this email already exists' })
    }

    // Validate manager exists if provided
    if (reportingManagerId) {
      if (!mongoose.isValidObjectId(reportingManagerId)) {
        return res.status(400).json({ success: false, message: 'Invalid reporting manager ID' })
      }
      const mgr = await Employee.findById(reportingManagerId)
      if (!mgr) {
        return res.status(400).json({ success: false, message: 'Reporting manager not found' })
      }
    }

    const employee = await Employee.create({
      name: name?.trim(),
      email: email?.toLowerCase().trim(),
      phone: phone?.trim(),
      department,
      designation,
      salary: Number(salary),
      joiningDate,
      status: status || 'Active',
      role: role || 'Employee',
      reportingManagerId: reportingManagerId || null,
      profileImage: profileImage || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      address: address || '',
    })

    const result = employee.toJSON()

    res.status(201).json({ success: true, data: result })
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    console.error('createEmployee error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// @route  PUT /api/employees/:id
// @desc   Update employee (full update by admin/hr; limited fields by self)
// @access Private
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' })
    }

    const employee = await Employee.findById(id)
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' })
    }

    const isSelf = req.user.employeeRecordId?.toString() === id
    const isSuperAdmin = req.user.role === 'Super Admin'
    const isHR = req.user.role === 'HR Manager'

    // HR cannot update Super Admin records
    if (isHR && employee.role === 'Super Admin') {
      return res.status(403).json({ success: false, message: 'HR Managers cannot edit Super Admin records' })
    }

    // Employees can only update their own limited fields
    if (!isSuperAdmin && !isHR && !isSelf) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    let updateData = { ...req.body }

    // If employee is editing their own profile, restrict to safe fields only
    if (isSelf && !isSuperAdmin && !isHR) {
      const { phone, address, profileImage } = req.body
      updateData = { phone, address, profileImage }
    }

    // HR cannot assign Super Admin role
    if (isHR && updateData.role === 'Super Admin') {
      return res.status(403).json({ success: false, message: 'HR Managers cannot assign Super Admin role' })
    }

    // Validate reporting manager if changing
    if (updateData.reportingManagerId !== undefined) {
      if (updateData.reportingManagerId) {
        if (!mongoose.isValidObjectId(updateData.reportingManagerId)) {
          return res.status(400).json({ success: false, message: 'Invalid reporting manager ID' })
        }
        const cycle = await wouldCreateCycle(id, updateData.reportingManagerId)
        if (cycle) {
          return res.status(400).json({
            success: false,
            message: 'This assignment would create a circular reporting chain',
          })
        }
      } else {
        updateData.reportingManagerId = null
      }
    }

    // Remove undefined fields
    Object.keys(updateData).forEach((k) => updateData[k] === undefined && delete updateData[k])

    const updated = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean({ virtuals: true })

    const normalized = {
      ...updated,
      id: updated._id.toString(),
      reportingManagerId: updated.reportingManagerId ? updated.reportingManagerId.toString() : null,
    }

    res.status(200).json({ success: true, data: normalized })
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    console.error('updateEmployee error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// @route  DELETE /api/employees/:id
// @desc   Soft delete (isDeleted = true)
// @access Private — Super Admin only
export const softDeleteEmployee = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' })
    }

    const employee = await Employee.findByIdAndUpdate(
      id,
      { isDeleted: true, status: 'Inactive' },
      { new: true }
    ).lean({ virtuals: true })

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' })
    }

    const normalized = {
      ...employee,
      id: employee._id.toString(),
      reportingManagerId: employee.reportingManagerId ? employee.reportingManagerId.toString() : null,
    }

    res.status(200).json({ success: true, data: normalized, message: 'Employee soft deleted' })
  } catch (err) {
    console.error('softDeleteEmployee error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// @route  PATCH /api/employees/:id/restore
// @desc   Restore soft-deleted employee
// @access Private — Super Admin only
export const restoreEmployee = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' })
    }

    const employee = await Employee.findByIdAndUpdate(
      id,
      { isDeleted: false, status: 'Active' },
      { new: true }
    ).lean({ virtuals: true })

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' })
    }

    const normalized = {
      ...employee,
      id: employee._id.toString(),
      reportingManagerId: employee.reportingManagerId ? employee.reportingManagerId.toString() : null,
    }

    res.status(200).json({ success: true, data: normalized, message: 'Employee restored' })
  } catch (err) {
    console.error('restoreEmployee error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// @route  PATCH /api/employees/:id/manager
// @desc   Assign or change reporting manager
// @access Private — Super Admin, HR Manager
export const assignManager = async (req, res) => {
  try {
    const { id } = req.params
    const { managerId } = req.body

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' })
    }

    if (managerId && !mongoose.isValidObjectId(managerId)) {
      return res.status(400).json({ success: false, message: 'Invalid manager ID' })
    }

    const employee = await Employee.findById(id)
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' })
    }

    if (managerId) {
      const cycle = await wouldCreateCycle(id, managerId)
      if (cycle) {
        return res.status(400).json({
          success: false,
          message: 'This assignment would create a circular reporting chain',
        })
      }
    }

    employee.reportingManagerId = managerId || null
    await employee.save()

    const result = employee.toJSON()

    res.status(200).json({ success: true, data: result, message: 'Manager assigned' })
  } catch (err) {
    console.error('assignManager error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// @route  GET /api/employees/:id/reportees
// @desc   Get direct reports of an employee
// @access Private
export const getReportees = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' })
    }

    const reportees = await Employee.find({
      reportingManagerId: id,
      isDeleted: false,
    }).lean({ virtuals: true })

    const normalized = reportees.map((e) => ({
      ...e,
      id: e._id.toString(),
      reportingManagerId: e.reportingManagerId ? e.reportingManagerId.toString() : null,
    }))

    res.status(200).json({ success: true, data: normalized })
  } catch (err) {
    console.error('getReportees error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// @route  POST /api/employees/bulk-import
// @desc   Bulk import employees from CSV data
// @access Private — Super Admin, HR Manager
export const bulkImport = async (req, res) => {
  try {
    const { rows } = req.body

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No rows provided for import' })
    }

    let imported = 0
    let skipped = 0
    const errors = []

    for (const row of rows) {
      if (!row.name || !row.email) {
        skipped++
        errors.push(`Skipped row: missing name or email (${row.email || 'no email'})`)
        continue
      }

      const exists = await Employee.findOne({ email: row.email.toLowerCase().trim() })
      if (exists) {
        skipped++
        errors.push(`Skipped: ${row.email} already exists`)
        continue
      }

      try {
        await Employee.create({
          name: row.name.trim(),
          email: row.email.toLowerCase().trim(),
          phone: row.phone || '',
          department: row.department || 'Engineering',
          designation: row.designation || 'Associate',
          salary: Number(row.salary) || 0,
          joiningDate: row.joiningDate || new Date().toISOString().slice(0, 10),
          status: row.status === 'Inactive' ? 'Inactive' : 'Active',
          role: 'Employee',
          reportingManagerId: null,
          profileImage: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
        })
        imported++
      } catch (e) {
        skipped++
        errors.push(`Error importing ${row.email}: ${e.message}`)
      }
    }

    res.status(200).json({ success: true, imported, skipped, errors })
  } catch (err) {
    console.error('bulkImport error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
