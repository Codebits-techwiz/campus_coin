import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from './Button';

const navLinks = [
  { label: 'Home', to: '/', hash: '' },
  { label: 'Features', to: '/', hash: '#features' },
  { label: 'How It Works', to: '/', hash: '#how-it-works' },
  { label: 'Testimonials', to: '/', hash: '#testimonials' },
  { label: 'FAQ', to: '/', hash: '#faq' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const goHash = (hash) => {
    setOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        <Link to="/" onClick={() => setOpen(false)} className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-cc-muted">
          {navLinks.map((l) => (
            <button
              key={l.label}
              type="button"
              onClick={() => goHash(l.hash)}
              className="hover:text-cc-forest transition"
            >
              {l.label}
            </button>
          ))}
          <Link to="/sitemap" className="hover:text-cc-forest transition">
            Sitemap
          </Link>
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-cc-forest hover:text-cc-lime transition px-2">
            Login
          </Link>
          <Button onClick={() => navigate('/register')} className="!rounded-full !px-5">
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 rounded-lg text-cc-forest hover:bg-cc-mint"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-3 animate-fade-in">
          {navLinks.map((l) => (
            <button
              key={l.label}
              type="button"
              onClick={() => goHash(l.hash)}
              className="block w-full text-left py-2 font-medium text-cc-ink"
            >
              {l.label}
            </button>
          ))}
          <Link to="/sitemap" onClick={() => setOpen(false)} className="block py-2 font-medium text-cc-ink">
            Sitemap
          </Link>
          <div className="pt-3 border-t border-gray-100 flex gap-3">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex-1 py-2.5 text-center border-2 border-cc-forest text-cc-forest rounded-xl font-semibold"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="flex-1 py-2.5 text-center bg-cc-forest text-white rounded-xl font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
