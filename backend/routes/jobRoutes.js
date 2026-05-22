import express from 'express';
import { getJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);

router.post('/', verifyToken, requireRole('employer'), createJob);
router.put('/:id', verifyToken, requireRole('employer'), updateJob);
router.delete('/:id', verifyToken, requireRole('employer', 'admin'), deleteJob);

export default router;
