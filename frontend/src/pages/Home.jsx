import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Briefcase, Building, Sparkles } from 'lucide-react';

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/jobs?keyword=${encodeURIComponent(keyword)}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
            Find your <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">dream job</span> today
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Connect with top employers and discover opportunities that match your unique skills and aspirations.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto bg-card rounded-2xl shadow-xl p-2 flex flex-col sm:flex-row gap-2 border border-border">
            <div className="flex-1 flex items-center px-4 bg-background rounded-xl border border-border/50">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <input 
                type="text" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, keywords, or company" 
                className="w-full bg-transparent border-none focus:outline-none py-4 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button 
              type="submit"
              className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-medium hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-primary/20 cursor-pointer"
            >
              Search Jobs
            </button>
          </form>

          <div className="flex justify-center pt-2">
            <Link 
              to="/resume-match"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-semibold transition-all hover:scale-105"
            >
              <Sparkles className="h-5 w-5 text-primary animate-pulse" /> Try AI Resume Matcher
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-8">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <span>10,000+ Active Jobs</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <span>5,000+ Companies</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
