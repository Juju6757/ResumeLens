import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/resume', resumeRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/admin', adminRoutes);

// Static files for uploaded resumes
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes placeholder
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: "Job Portal API is running" });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
