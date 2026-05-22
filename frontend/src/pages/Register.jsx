import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-card border border-border rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
      <p className="text-center text-muted-foreground mb-4">Registration form coming soon...</p>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
      </div>
    </div>
  );
};

export default Register;
