import express from 'express'
import { getOrgTree } from '../controllers/organizationController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)
router.get('/tree', getOrgTree)

export default router
