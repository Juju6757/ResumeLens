import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Briefcase, MapPin, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResumeMatch = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Only PDF resumes are supported currently.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Only PDF resumes are supported currently.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('/api/v1/resume/parse-and-match', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        setResults(response.data);
      } else {
        setError(response.data.message || 'Failed to match jobs.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while uploading and parsing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl flex items-center justify-center gap-2">
          AI Resume Matcher <Sparkles className="text-primary animate-pulse" />
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-muted-foreground">
          Upload your resume in PDF format. Our algorithm will instantly parse your skills and match you with the best available jobs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Column */}
        <div className="lg:col-span-4 bg-card border border-border/80 rounded-2xl p-6 shadow-xl relative backdrop-blur-md">
          <h2 className="text-xl font-bold mb-4 text-foreground">Upload Resume</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors relative ${
                dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              } ${file ? 'bg-primary/5 border-primary/30' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('resume-file').click()}
            >
              <input
                type="file"
                id="resume-file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
              
              <div className="flex flex-col items-center justify-center space-y-3">
                {file ? (
                  <>
                    <FileText className="h-12 w-12 text-primary" />
                    <div className="text-sm font-medium text-foreground max-w-[200px] truncate">
                      {file.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <div className="text-sm font-medium text-foreground">
                      Drag & drop your PDF here or <span className="text-primary hover:underline">browse</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Supports PDF up to 5MB
                    </div>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:bg-primary/95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                'Match Jobs'
              )}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-card border border-border/80 rounded-2xl p-12 text-center shadow-xl flex flex-col items-center justify-center space-y-4"
              >
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Reading Skills & Scanning Jobs...</h3>
                <p className="text-muted-foreground max-w-sm">We are cross-referencing your resume's skills against 2,000+ active job openings in our portal.</p>
              </motion.div>
            )}

            {!loading && !results && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card/50 border border-border/50 border-dashed rounded-2xl p-16 text-center shadow-inner flex flex-col items-center justify-center space-y-3"
              >
                <Briefcase className="h-14 w-14 text-muted-foreground/60" />
                <h3 className="text-lg font-semibold text-foreground">No matches generated yet</h3>
                <p className="text-muted-foreground max-w-sm">Upload your resume on the left to see immediate job recommendations based on your unique skill set.</p>
              </motion.div>
            )}

            {!loading && results && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Skills Card */}
                <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                  <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle2 className="text-green-500 h-5 w-5" />
                    Skills Identified ({results.skills?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.skills && results.skills.length > 0 ? (
                      results.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No skills identified. Make sure your resume is high quality and includes keywords.</span>
                    )}
                  </div>
                </div>

                {/* Job Matches */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">
                    Matching Jobs ({results.jobs?.length || 0})
                  </h3>
                  
                  {results.jobs && results.jobs.length > 0 ? (
                    results.jobs.map((job, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={job._id}
                        className="bg-card border border-border hover:border-primary/40 rounded-2xl p-6 shadow-md transition-all hover:shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-500">
                              {job.score}% Match
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">{job.jobType}</span>
                          </div>
                          
                          <h4 className="text-xl font-bold text-foreground hover:text-primary transition-colors">
                            <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                          </h4>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" /> {job.location}
                            </span>
                            {job.salaryMin && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" /> ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {job.skillsRequired?.map((skill, index) => {
                              const isMatched = results.skills?.some(s => s.toLowerCase() === skill.toLowerCase());
                              return (
                                <span 
                                  key={index} 
                                  className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                                    isMatched 
                                      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                      : 'bg-secondary text-muted-foreground border-border'
                                  }`}
                                >
                                  {skill}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center justify-end">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-sm shadow hover:bg-primary/95 transition-colors"
                          >
                            View & Apply
                          </Link>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
                      No jobs matched your skills. Try adding more skills or uploading a different resume.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ResumeMatch;
