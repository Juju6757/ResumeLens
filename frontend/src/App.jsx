import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import ResumeMatch from './pages/ResumeMatch';
import CandidateDashboard from './pages/dashboard/CandidateDashboard';
import EmployerDashboard from './pages/dashboard/EmployerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AnimatedBackground from './components/AnimatedBackground';
import FloatingDock from './components/FloatingDock';

function App() {
  return (
    <Router>
      <AnimatedBackground />
      <div className="min-h-screen bg-transparent text-foreground flex flex-col font-sans relative">
        <Navbar />
        <FloatingDock />
        <main className="flex-1 pt-16">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/resume-match" element={<ResumeMatch />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard/candidate" 
              element={
                <ProtectedRoute roles={['candidate']}>
                  <CandidateDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/employer" 
              element={
                <ProtectedRoute roles={['employer']}>
                  <EmployerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
