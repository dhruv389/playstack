import Employee from '../models/Employee.js'

// Build org tree recursively from a flat list
const buildTree = (employees, parentId = null) => {
  return employees
    .filter((e) => {
      const mgrId = e.reportingManagerId ? e.reportingManagerId.toString() : null
      return mgrId === (parentId ? parentId.toString() : null)
    })
    .map((e) => ({
      ...e,
      children: buildTree(employees, e._id),
    }))
}

// @route  GET /api/organization/tree
// @desc   Get the full org hierarchy tree
// @access Private
export const getOrgTree = async (req, res) => {
  try {
    const employees = await Employee.find({ isDeleted: false })
      .select('_id employeeId name email department designation role status profileImage reportingManagerId')
      .lean({ virtuals: true })

    // Normalize IDs
    const normalized = employees.map((e) => ({
      ...e,
      id: e._id.toString(),
      reportingManagerId: e.reportingManagerId ? e.reportingManagerId.toString() : null,
    }))

    // Build tree starting from root nodes (no manager)
    const tree = buildTree(normalized)

    res.status(200).json({ success: true, data: tree, flat: normalized })
  } catch (err) {
    console.error('getOrgTree error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
