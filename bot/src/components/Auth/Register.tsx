import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Registered successfully (mock)');
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Register</h2>
      <input className="w-full border p-2 text-black" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="w-full border p-2 text-black" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Register</button>
      <p className="text-sm text-center">
        Already have an account? <Link to="/login" className="text-blue-500 underline">Login</Link>
      </p>
    </form>
  );
};

export default Register;