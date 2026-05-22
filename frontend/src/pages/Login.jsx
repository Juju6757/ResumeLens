import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('candidate1@example.com');
  const [password, setPassword] = useState('password123');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login for now
    login({ name: 'Candidate 1', email, role: email.includes('admin') ? 'admin' : email.includes('employer') ? 'employer' : 'candidate' }, 'mock-token');
    
    if (email.includes('admin')) navigate('/dashboard/admin');
    else if (email.includes('employer')) navigate('/dashboard/employer');
    else navigate('/dashboard/candidate');
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-card border border-border rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Log in to JobPortal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            className="w-full p-2 border border-border rounded bg-background" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input 
            type="password" 
            className="w-full p-2 border border-border rounded bg-background" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90">
          Log in
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
      </div>
    </div>
  );
};

export default Login;
