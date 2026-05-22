import express from 'express';
import { uploadResume, getParsedResume, parseAndMatchJobs } from '../controllers/resumeController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/upload', verifyToken, requireRole('candidate'), upload.single('resume'), uploadResume);
router.get('/parsed', verifyToken, requireRole('candidate'), getParsedResume);
router.post('/parse-and-match', upload.single('resume'), parseAndMatchJobs);

export default router;
