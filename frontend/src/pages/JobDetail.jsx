import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Briefcase, DollarSign, Building, Calendar, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/jobs/${id}`);
        setJob(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-destructive/10 text-destructive p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p>{error || 'Job not found'}</p>
        </div>
        <Link to="/jobs" className="text-primary hover:underline font-medium inline-flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-4rem)]">
      <Link to="/jobs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-8 border border-border shadow-sm"
          >
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Building className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-foreground mb-1">{job.title}</h1>
                  <p className="text-lg text-muted-foreground font-medium">
                    {job.employerId?.name || 'Awesome Company'}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1).replace('-', ' ')}
              </span>
            </div>

            <div className="flex flex-wrap gap-6 mb-8 text-sm font-medium text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary/70" />
                {job.location}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary/70" />
                ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary/70" />
                Posted on {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {job.skillsRequired?.map((skill, index) => (
                <span key={index} className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium border border-border/50">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-3xl p-8 border border-border shadow-sm"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">Job Description</h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none mb-8 text-muted-foreground">
              {job.description?.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-4 mt-8">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-3xl p-6 border border-border shadow-sm sticky top-24"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">Job Overview</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Date Posted</p>
                  <p className="text-sm text-muted-foreground">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Briefcase className="h-5 w-5 mr-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Job Type</p>
                  <p className="text-sm text-muted-foreground capitalize">{job.jobType.replace('-', ' ')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground">{job.location}</p>
                </div>
              </div>
              <div className="flex items-start">
                <DollarSign className="h-5 w-5 mr-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Salary Range</p>
                  <p className="text-sm text-muted-foreground">${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-md active:scale-[0.98]">
              Apply Now
            </button>
            <button className="w-full mt-3 bg-secondary text-secondary-foreground py-3 rounded-xl font-medium hover:bg-secondary/80 transition-all">
              Save Job
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
