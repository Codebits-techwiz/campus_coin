import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';
import api from '../../api';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { showToast } = useApp();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      if (res.data.success) {
        setSent(true);


        showToast(res.data.message || 'Password reset link sent', 'success');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-cc-mint-soft to-cc-cream animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <Logo className="justify-center mb-6" />
        {sent ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-cc-lime mx-auto" />
            <h1 className="text-xl font-extrabold text-cc-forest">Check your email</h1>
            <p className="text-sm text-cc-muted">
              We sent a tokenized reset link to <strong>{email}</strong>.
            </p>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-cc-lime">
              <ArrowLeft className="w-4 h-4" /> {t('auth.backToLogin')}
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold text-cc-forest text-center">{t('auth.forgotTitle')}</h1>
            <p className="text-sm text-cc-muted text-center mt-1 mb-6">
              {t('auth.forgotSub')}
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">{t('auth.email')}</label>
                <div className="mt-1.5 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-cc-lime outline-none text-sm"
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full !rounded-xl !py-3">
                {loading ? t('auth.sending') : t('auth.sendLink')}
              </Button>
            </form>
            <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-cc-muted hover:text-cc-forest">
              <ArrowLeft className="w-4 h-4" /> {t('auth.backToLogin')}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
