import mongoose from 'mongoose';

const employerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyLogo: {
    type: String,
    default: null,
  },
  industry: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  verified: {
    type: Boolean,
    default: false, // set by admin
  }
}, { timestamps: true });

export default mongoose.model('EmployerProfile', employerProfileSchema);
