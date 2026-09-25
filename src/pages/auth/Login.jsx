import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';
import api from '../../api';

export default function Login() {
  const navigate = useNavigate();
  const { setRole, setProfile, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (res.data.success) {
        // Fetch profile to populate context
        const profileRes = await api.get('/api/users/profile');
        if (profileRes.data.success) {
          setProfile(profileRes.data.data);
          setRole(profileRes.data.data.role);
          showToast(res.data.message || 'Logged in successfully', 'success');
          navigate('/app');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-cc-mint-soft to-white animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <Logo className="justify-center mb-4" />
          <h1 className="text-2xl font-extrabold text-cc-forest">Welcome back</h1>
          <p className="text-sm text-cc-muted mt-1">Sign in to your Campus Coin account</p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">Email</label>
            <div className="mt-1.5 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-cc-lime focus:ring-2 focus:ring-cc-lime/20 outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">Password</label>
            <div className="mt-1.5 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-cc-lime focus:ring-2 focus:ring-cc-lime/20 outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs font-semibold text-cc-lime hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" disabled={loading} className="w-full !rounded-xl !py-3">
            {loading ? 'Signing In...' : <><span className="mr-2">Sign In</span> <ArrowRight className="w-4 h-4" /></>}
          </Button>
        </form>
        <p className="text-center text-sm text-cc-muted mt-6">
          New here?{' '}
          <Link to="/register" className="font-semibold text-cc-forest hover:text-cc-lime">
            Create an account
          </Link>
        </p>
        <p className="text-center text-xs text-cc-muted mt-4">
          Admin?{' '}
          <Link to="/admin-login" className="font-semibold text-cc-lime hover:underline">
            Administrator login
          </Link>
        </p>
        <p className="text-[11px] text-center text-cc-muted/70 mt-4 bg-cc-mint rounded-lg py-2 px-3">
          Demo: ayesha@campus.edu / student123
        </p>
      </div>
    </div>
  );
}
