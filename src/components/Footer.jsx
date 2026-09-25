import { Link } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { Logo } from './Logo';

const socials = ['X / Twitter', 'Instagram', 'LinkedIn', 'YouTube'];

export function Footer() {
  return (
    <footer className="bg-cc-forest text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-10">
          <div className="max-w-xs space-y-3">
            <Logo dark />
            <p className="text-sm text-white/70 leading-relaxed">
              Smart spending for students — track income, expenses, and get AI-powered insights without linking a bank.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80">
            <a href="/#features" className="hover:text-cc-lime transition">Features</a>
            <a href="/#how-it-works" className="hover:text-cc-lime transition">How It Works</a>
            <a href="/#testimonials" className="hover:text-cc-lime transition">Testimonials</a>
            <a href="/#faq" className="hover:text-cc-lime transition">FAQ</a>
            <Link to="/sitemap" className="hover:text-cc-lime transition">Sitemap</Link>
            <Link to="/login" className="hover:text-cc-lime transition">Login</Link>
          </nav>

          <div className="flex items-center gap-3">
            {socials.map((label) => (
              <a
                key={label}
                href="#"
                title={label}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-cc-lime hover:border-cc-lime transition"
                aria-label={label}
              >
                <Share2 className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/50">
          <p>Campus Coin — NextGen BudgetBee · End-to-End Web Solutions</p>
          <p>© 2026 Campus Coin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
