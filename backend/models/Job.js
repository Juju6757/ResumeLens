import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [{
    type: String,
  }],
  skillsRequired: [{
    type: String,
  }],
  location: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'remote'],
    required: true,
  },
  salaryMin: {
    type: Number,
  },
  salaryMax: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'flagged'],
    default: 'draft',
  },
  applicantsCount: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
  }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
