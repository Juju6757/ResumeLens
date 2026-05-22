import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');
import fs from 'fs';
import CandidateProfile from '../models/CandidateProfile.js';
import Job from '../models/Job.js';

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;

    // Simple parsing logic (only works properly for PDFs in this example)
    let parsedData = { text: '' };
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const parser = new PDFParse({ data: dataBuffer });
      parsedData = await parser.getText();
    }

    const extractedText = parsedData.text;
    
    // Basic Keyword extraction logic (mocked up, for a real app we'd use NLP)
    const keywords = ['react', 'node.js', 'javascript', 'python', 'java', 'mongodb', 'express', 'sql', 'css', 'html', 'docker', 'aws', 'typescript'];
    const extractedSkills = keywords.filter(kw => new RegExp(kw, 'i').test(extractedText));

    const parsedResumeObj = {
      rawText: extractedText.substring(0, 500) + '...', // Store only a snippet
      extractedSkills
    };

    const profile = await CandidateProfile.findOneAndUpdate(
      { userId: req.user.id },
      { 
        resumeUrl,
        parsedResume: parsedResumeObj,
        $addToSet: { skills: { $each: extractedSkills } } // automatically add extracted skills
      },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Resume uploaded and parsed successfully',
      data: {
        resumeUrl,
        parsedData: parsedResumeObj
      }
    });

  } catch (error) {
    console.error('Resume upload error', error);
    res.status(500).json({ success: false, message: 'Server error during parsing' });
  }
};

export const getParsedResume = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, data: profile.parsedResume });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const parseAndMatchJobs = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume file' });
    }

    let parsedText = '';
    
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const parser = new PDFParse({ data: dataBuffer });
      const parsedData = await parser.getText();
      parsedText = parsedData.text;
    } else {
      // Fallback for doc/docx/text files
      try {
        parsedText = fs.readFileSync(req.file.path, 'utf8');
      } catch (err) {
        parsedText = 'Fallback text content';
      }
    }

    // Clean up uploaded file
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.error('Failed to delete temp resume file', e);
    }

    const keywords = [
      'react', 'node.js', 'javascript', 'python', 'java', 'mongodb', 'express', 'sql', 'css', 'html', 
      'docker', 'aws', 'typescript', 'c++', 'c#', 'php', 'ruby', 'rails', 'django', 'flask', 
      'angular', 'vue', 'next.js', 'kubernetes', 'devops', 'machine learning', 'data science', 
      'marketing', 'sales', 'hr', 'finance', 'project management', 'ui/ux', 'design', 'figma',
      'tailwind', 'rest apis', 'rest api', 'agile', 'scrum', 'salesforce', 'seo', 'sem'
    ];

    const extractedSkills = keywords.filter(kw => {
      // Escape dots (like in node.js) for regex matching
      const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKw}\\b`, 'i');
      return regex.test(parsedText);
    });

    if (extractedSkills.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No matching skills could be parsed from the resume.',
        skills: [],
        jobs: []
      });
    }

    const activeJobs = await Job.find({ status: 'active' });

    const matchedJobs = activeJobs.map(job => {
      const skillsRequired = job.skillsRequired || [];
      if (skillsRequired.length === 0) {
        return { ...job.toObject(), score: 0, matchingSkills: [] };
      }

      // Check overlap
      const matchingSkills = skillsRequired.filter(skill => 
        extractedSkills.some(extSkill => extSkill.toLowerCase() === skill.toLowerCase())
      );

      const score = Math.round((matchingSkills.length / skillsRequired.length) * 100);

      return {
        ...job.toObject(),
        score,
        matchingSkills
      };
    })
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

    res.status(200).json({
      success: true,
      message: 'Resume parsed and jobs matched successfully',
      skills: extractedSkills,
      jobs: matchedJobs
    });

  } catch (error) {
    console.error('Parse and match error:', error);
    res.status(500).json({ success: false, message: 'Server error during parsing and matching' });
  }
};
