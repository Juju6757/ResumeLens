import express from 'express';
import { getUsers, banUser, getAllJobs, updateJobStatus, verifyEmployer, getStats } from '../controllers/adminController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyToken, requireRole('admin'));

router.get('/users', getUsers);
router.patch('/users/:id/ban', banUser);
router.get('/jobs', getAllJobs);
router.patch('/jobs/:id/status', updateJobStatus);
router.get('/employers/:id/verify', verifyEmployer);
router.get('/stats', getStats);

export default router;
