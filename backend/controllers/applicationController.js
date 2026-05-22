import Application from '../models/Application.js';
import Job from '../models/Job.js';
import CandidateProfile from '../models/CandidateProfile.js';
import { computeMatchScore } from '../utils/matchScore.js';

export const applyToJob = async (req, res) => {
  try {
    const { jobId, resumeUrl, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const candidateProfile = await CandidateProfile.findOne({ userId: req.user.id });
    if (!candidateProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }

    const existingApplication = await Application.findOne({ jobId, candidateId: req.user.id });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'Already applied to this job' });
    }

    const matchScore = computeMatchScore(candidateProfile.skills, job.skillsRequired);

    const application = await Application.create({
      jobId,
      candidateId: req.user.id,
      resumeUrl: resumeUrl || candidateProfile.resumeUrl,
      coverLetter,
      matchScore
    });

    job.applicantsCount += 1;
    await job.save();

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error('Apply error', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user.id })
      .populate({
        path: 'jobId',
        select: 'title location jobType salaryMin salaryMax status employerId',
        populate: {
          path: 'employerId',
          select: 'name avatarUrl',
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.employerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate({
        path: 'candidateId',
        select: 'name email avatarUrl',
      })
      .sort({ matchScore: -1 });

    // In a real scenario we might also want to fetch and merge the CandidateProfile data for each applicant here
    
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.jobId.employerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.candidateId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Cannot withdraw processed application' });
    }

    await Application.findByIdAndDelete(req.params.id);

    const job = await Job.findById(application.jobId);
    if (job) {
      job.applicantsCount = Math.max(0, job.applicantsCount - 1);
      await job.save();
    }

    res.status(200).json({ success: true, message: 'Application withdrawn' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
