import express from 'express';
import { 
  applyToJob, 
  getMyApplications, 
  getJobApplicants, 
  updateApplicationStatus, 
  withdrawApplication 
} from '../controllers/applicationController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', verifyToken, requireRole('candidate'), applyToJob);
router.get('/my', verifyToken, requireRole('candidate'), getMyApplications);
router.get('/job/:jobId', verifyToken, requireRole('employer'), getJobApplicants);
router.patch('/:id/status', verifyToken, requireRole('employer'), updateApplicationStatus);
router.delete('/:id', verifyToken, requireRole('candidate'), withdrawApplication);

export default router;
