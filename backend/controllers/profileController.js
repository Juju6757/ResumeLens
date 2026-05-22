import User from '../models/User.js';
import CandidateProfile from '../models/CandidateProfile.js';
import EmployerProfile from '../models/EmployerProfile.js';

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let profile = null;
    if (user.role === 'candidate') {
      profile = await CandidateProfile.findOne({ userId: user._id });
    } else if (user.role === 'employer') {
      profile = await EmployerProfile.findOne({ userId: user._id });
    }

    res.status(200).json({ success: true, data: { user, profile } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCandidateProfile = async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ success: false, message: 'Only candidates can update candidate profiles' });
    }

    const { headline, summary, skills, experience, education } = req.body;

    const profile = await CandidateProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { headline, summary, skills, experience, education } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateEmployerProfile = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ success: false, message: 'Only employers can update employer profiles' });
    }

    const { companyName, companyLogo, industry, website, description, location } = req.body;

    const profile = await EmployerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { companyName, companyLogo, industry, website, description, location } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
