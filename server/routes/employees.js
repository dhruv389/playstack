import express from 'express'
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  softDeleteEmployee,
  restoreEmployee,
  assignManager,
  getReportees,
  bulkImport,
} from '../controllers/employeeController.js'
import { protect } from '../middleware/auth.js'
import { authorize } from '../middleware/rbac.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

// Bulk import
router.post('/bulk-import', authorize('Super Admin', 'HR Manager'), bulkImport)

// CRUD
router
  .route('/')
  .get(getEmployees)
  .post(authorize('Super Admin', 'HR Manager'), createEmployee)

router
  .route('/:id')
  .get(getEmployee)
  .put(updateEmployee)                          // access control handled inside controller
  .delete(authorize('Super Admin'), softDeleteEmployee)

// Special actions
router.patch('/:id/restore', authorize('Super Admin'), restoreEmployee)
router.patch('/:id/manager', authorize('Super Admin', 'HR Manager'), assignManager)
router.get('/:id/reportees', getReportees)

export default router
