import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Briefcase, DollarSign, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keywordQuery = searchParams.get('keyword') || '';
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(keywordQuery);

  const fetchJobs = async (searchKeyword = '') => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/jobs', {
        params: { keyword: searchKeyword }
      });
      setJobs(res.data.data);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when the URL query params change
  useEffect(() => {
    fetchJobs(keywordQuery);
    setKeyword(keywordQuery); // sync local input state with URL
  }, [keywordQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setSearchParams({ keyword });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-4rem)]">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-4">
          Discover Opportunities
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse through our curated list of top jobs and find your perfect fit.
        </p>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12 bg-card rounded-2xl shadow-sm p-2 flex flex-col sm:flex-row gap-2 border border-border">
        <div className="flex-1 flex items-center px-4 bg-background rounded-xl border border-border/50">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <input 
            type="text" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by job title, skill, or company..." 
            className="w-full bg-transparent border-none focus:outline-none py-4 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <button 
          type="submit"
          className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-medium hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-md"
        >
          Search
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No jobs found</h2>
          <p className="text-muted-foreground">Try adjusting your search keywords to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={job._id} 
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col h-full"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Building className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {job.jobType === 'remote' ? 'Remote' : 'Full-time'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {job.title}
                </h3>
                
                <div className="text-muted-foreground text-sm font-medium mb-4 flex items-center gap-2">
                  {job.employerId?.name || 'Awesome Company'}
                </div>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-2 text-primary/70" />
                    ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skillsRequired?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium border border-border/50">
                      {skill}
                    </span>
                  ))}
                  {job.skillsRequired?.length > 3 && (
                    <span className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium border border-border/50">
                      +{job.skillsRequired.length - 3}
                    </span>
                  )}
                </div>
                
                <Link 
                  to={`/jobs/${job._id}`} 
                  className="w-full inline-flex items-center justify-center py-3 px-4 border border-border rounded-xl text-sm font-medium text-foreground bg-background hover:bg-secondary hover:text-secondary-foreground transition-colors group-hover:border-primary/50"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
