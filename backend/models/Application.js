import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
  coverLetter: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    default: 'pending',
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  }
}, { timestamps: true });

// Prevent multiple applications from the same candidate for the same job
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
