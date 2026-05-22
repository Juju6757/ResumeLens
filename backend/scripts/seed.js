import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User.js';
import CandidateProfile from '../models/CandidateProfile.js';
import EmployerProfile from '../models/EmployerProfile.js';
import Job from '../models/Job.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for Seeding');

    // Clear existing
    await User.deleteMany();
    await CandidateProfile.deleteMany();
    await EmployerProfile.deleteMany();
    await Job.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Create Admins
    for (let i = 1; i <= 3; i++) {
      await User.create({
        name: `Admin User ${i}`,
        email: `admin${i}@example.com`,
        passwordHash,
        role: 'admin'
      });
    }

    // Create Employers
    const employers = [];
    for (let i = 1; i <= 5; i++) {
      const user = await User.create({
        name: `Employer User ${i}`,
        email: `employer${i}@example.com`,
        passwordHash,
        role: 'employer'
      });
      await EmployerProfile.create({
        userId: user._id,
        companyName: `Company Tech ${i}`,
        industry: 'Software',
        location: 'Remote',
        verified: true
      });
      employers.push(user);
    }

    // Create Candidates
    const candidates = [];
    for (let i = 1; i <= 20; i++) {
      const user = await User.create({
        name: `Candidate User ${i}`,
        email: `candidate${i}@example.com`,
        passwordHash,
        role: 'candidate'
      });
      await CandidateProfile.create({
        userId: user._id,
        headline: 'Full Stack Developer',
        skills: ['React', 'Node.js', 'MongoDB', 'Express'],
        resumeUrl: '/uploads/sample.pdf'
      });
      candidates.push(user);
    }

    // Create Jobs
    const jobTemplates = [
      // Tech & Engineering
      { title: 'Frontend React Developer', skills: ['React', 'JavaScript', 'Tailwind', 'CSS'], min: 70000, max: 110000 },
      { title: 'Backend Node.js Engineer', skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'], min: 80000, max: 120000 },
      { title: 'Full Stack MERN Developer', skills: ['MongoDB', 'Express', 'React', 'Node.js'], min: 90000, max: 130000 },
      { title: 'DevOps Engineer', skills: ['Docker', 'AWS', 'CI/CD', 'Kubernetes'], min: 100000, max: 150000 },
      { title: 'Cybersecurity Analyst', skills: ['Security', 'Network', 'Firewalls', 'SIEM'], min: 85000, max: 125000 },
      { title: 'Mobile App Developer', skills: ['React Native', 'Swift', 'Kotlin', 'Mobile'], min: 80000, max: 130000 },
      
      // Data & Analytics
      { title: 'Data Scientist', skills: ['Python', 'SQL', 'Machine Learning', 'Pandas'], min: 110000, max: 160000 },
      { title: 'Data Analyst', skills: ['SQL', 'Excel', 'Tableau', 'PowerBI'], min: 60000, max: 90000 },
      { title: 'Machine Learning Engineer', skills: ['TensorFlow', 'PyTorch', 'Python', 'Algorithms'], min: 120000, max: 180000 },
      
      // Design & Product
      { title: 'UX/UI Designer', skills: ['Figma', 'Wireframing', 'Prototyping', 'CSS'], min: 65000, max: 95000 },
      { title: 'Product Manager', skills: ['Agile', 'Jira', 'Scrum', 'Communication'], min: 95000, max: 140000 },
      { title: 'Graphic Designer', skills: ['Adobe CC', 'Illustrator', 'Photoshop', 'Creativity'], min: 50000, max: 75000 },

      // Marketing & Sales
      { title: 'Digital Marketing Manager', skills: ['SEO', 'SEM', 'Google Ads', 'Content'], min: 65000, max: 100000 },
      { title: 'Social Media Specialist', skills: ['Instagram', 'TikTok', 'Strategy', 'Analytics'], min: 45000, max: 70000 },
      { title: 'Sales Representative', skills: ['CRM', 'Negotiation', 'Communication', 'B2B'], min: 50000, max: 90000 },
      { title: 'Account Executive', skills: ['Salesforce', 'Closing', 'B2B Sales', 'Presentations'], min: 60000, max: 120000 },

      // Business & Operations
      { title: 'HR Generalist', skills: ['Recruiting', 'Onboarding', 'Employee Relations', 'Payroll'], min: 55000, max: 80000 },
      { title: 'Financial Analyst', skills: ['Modeling', 'Excel', 'Forecasting', 'Accounting'], min: 65000, max: 95000 },
      { title: 'Operations Manager', skills: ['Logistics', 'Leadership', 'Process Improvement', 'Strategy'], min: 75000, max: 115000 },
      { title: 'Customer Success Manager', skills: ['Empathy', 'Retention', 'Zendesk', 'Communication'], min: 55000, max: 85000 }
    ];

    const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Remote', 'London, UK', 'Toronto, CA', 'Berlin, DE', 'Sydney, AU'];
    const jobTypes = ['full-time', 'part-time', 'contract', 'remote'];

    const jobsToInsert = [];
    
    // Generate 2000 jobs
    for (let i = 0; i < 2000; i++) {
      const employer = employers[Math.floor(Math.random() * employers.length)];
      const template = jobTemplates[Math.floor(Math.random() * jobTemplates.length)];
      
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomJobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
      
      const randomMin = template.min + Math.floor(Math.random() * 15000);
      const randomMax = Math.max(randomMin + 10000, template.max + Math.floor(Math.random() * 25000));

      jobsToInsert.push({
        employerId: employer._id,
        title: `${template.title} (Level ${Math.floor(Math.random() * 3) + 1})`,
        description: `We are looking for a highly skilled ${template.title} to join our growing team. This role will involve working with dynamic teams to deliver exceptional results. Ideal candidates will have strong experience in our core tech stack and business methodologies.`,
        requirements: ['3+ years of relevant experience', 'Strong problem solving skills', 'Excellent team player', 'Proven track record of success'],
        skillsRequired: template.skills,
        location: randomLocation,
        jobType: randomJobType,
        salaryMin: randomMin,
        salaryMax: randomMax,
        status: 'active'
      });
    }

    console.log('Inserting 2000 jobs into the database... (this may take a moment)');
    await Job.insertMany(jobsToInsert);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error', error);
    process.exit(1);
  }
};

seedDatabase();
