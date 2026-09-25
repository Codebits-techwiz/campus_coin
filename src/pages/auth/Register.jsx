import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, GraduationCap } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';
import api from '../../api';

export default function Register() {
  const navigate = useNavigate();
  const { setRole, showToast, setProfile } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    academicYear: 'Year 1',
    allowance: '800',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
      };
      
      const res = await api.post('/api/auth/register', payload);
      
      if (res.data.success) {
        const profileRes = await api.get('/api/users/profile');
        if (profileRes.data.success) {
          setProfile(profileRes.data.data);
          setRole(profileRes.data.data.role);
          showToast(res.data.message || 'Account created! Welcome to Campus Coin.', 'success');
          navigate('/app');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-cc-mint-soft to-white animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <Logo className="justify-center mb-4" />
          <h1 className="text-2xl font-extrabold text-cc-forest">Create your account</h1>
          <p className="text-sm text-cc-muted mt-1">Start tracking smarter in under a minute</p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {[
            { icon: User, label: 'Full name', key: 'name', type: 'text', placeholder: 'Ayesha Khan' },
            { icon: Mail, label: 'Email', key: 'email', type: 'email', placeholder: 'you@campus.edu' },
            { icon: Lock, label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
          ].map(({ icon: Icon, label, key, type, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">{label}</label>
              <div className="mt-1 relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                <input
                  type={type}
                  required
                  value={form[key]}
                  onChange={set(key)}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-cc-lime focus:ring-2 focus:ring-cc-lime/20 outline-none text-sm"
                />
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">Academic year</label>
              <div className="mt-1 relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                <select
                  value={form.academicYear}
                  onChange={set('academicYear')}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 focus:border-cc-lime outline-none text-sm appearance-none bg-white"
                >
                  {['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Graduate'].map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">Monthly allowance</label>
              <input
                type="number"
                value={form.allowance}
                onChange={set('allowance')}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cc-lime outline-none text-sm"
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full !rounded-xl !py-3 mt-2">
            {loading ? 'Creating Account...' : <><span className="mr-2">Get Started Free</span> <ArrowRight className="w-4 h-4" /></>}
          </Button>
        </form>
        <p className="text-center text-sm text-cc-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-cc-forest hover:text-cc-lime">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
