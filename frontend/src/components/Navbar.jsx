import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Briefcase } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary tracking-tight">JobPortal</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user && (
              <div className="flex items-center gap-4">
                <Link 
                  to={`/dashboard/${user.role}`} 
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
