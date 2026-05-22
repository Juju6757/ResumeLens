import Job from '../models/Job.js';

export const getJobs = async (req, res) => {
  try {
    const { location, type, skills, salaryMin, salaryMax, keyword, page = 1, limit = 10 } = req.query;
    
    let query = { status: 'active' };

    if (location) query.location = new RegExp(location, 'i');
    if (type) query.jobType = type;
    if (salaryMin) query.salaryMin = { $gte: Number(salaryMin) };
    if (salaryMax) query.salaryMax = { $lte: Number(salaryMax) };
    if (keyword) {
      query.$or = [
        { title: new RegExp(keyword, 'i') },
        { description: new RegExp(keyword, 'i') }
      ];
    }
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skillsRequired = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate('employerId', 'name avatarUrl')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: jobs,
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

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employerId', 'name avatarUrl');
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, employerId: req.user.id });
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.employerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.employerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    job.status = 'closed';
    await job.save();

    res.status(200).json({ success: true, message: 'Job closed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
