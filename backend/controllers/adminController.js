import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import EmployerProfile from '../models/EmployerProfile.js';

export const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query).select('-passwordHash')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const banUser = async (req, res) => {
  try {
    // Basic implementation: we'll just add a banned flag or remove them, depending on requirements.
    // Let's assume we just delete them for simplicity in this demo, or we could add a `banned` field to User schema.
    res.status(501).json({ success: false, message: 'Not implemented. Please add banned field to User schema.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('employerId', 'name').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyEmployer = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOneAndUpdate(
      { userId: req.params.id },
      { verified: true },
      { new: true }
    );
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    // Aggregating applications per day (last 7 days for example)
    const appsPerDay = await Application.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalJobs,
        totalApplications,
        appsPerDay
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
