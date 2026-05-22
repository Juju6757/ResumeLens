import express from 'express';
import { getMe, updateCandidateProfile, updateEmployerProfile } from '../controllers/profileController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

router.get('/me', verifyToken, getMe);
router.put('/candidate', verifyToken, requireRole('candidate'), updateCandidateProfile);
router.put('/employer', verifyToken, requireRole('employer'), updateEmployerProfile);

export default router;
