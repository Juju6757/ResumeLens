import mongoose from 'mongoose';

const candidateProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  headline: {
    type: String,
    default: '',
  },
  summary: {
    type: String,
    default: '',
  },
  skills: [{
    type: String,
  }],
  experience: [{
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    description: String,
  }],
  education: [{
    degree: String,
    institution: String,
    year: String,
  }],
  resumeUrl: {
    type: String,
    default: null,
  },
  parsedResume: {
    type: mongoose.Schema.Types.Mixed, // Stores unstructured JSON data
    default: null,
  },
  linkedInImported: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export default mongoose.model('CandidateProfile', candidateProfileSchema);
