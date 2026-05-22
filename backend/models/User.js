import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['candidate', 'employer', 'admin'],
    required: true,
  },
  avatarUrl: {
    type: String,
    default: null,
  },
  linkedInId: {
    type: String,
    default: null,
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
