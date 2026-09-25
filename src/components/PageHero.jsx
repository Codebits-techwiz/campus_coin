import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';

/** Shared hero shell for public marketing pages */
export function PageHero({ eyebrow, title, subtitle, cta }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-cc-forest via-[#0f4a38] to-cc-forest-light text-white">
      <div className="absolute top-0 right-0 w-80 h-80 bg-cc-lime/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
        {eyebrow && (
          <span className="inline-flex text-cc-lime text-xs font-bold tracking-widest uppercase mb-3">
            {eyebrow}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-white/75 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        {cta && (
          <div className="mt-8">
            <Link to={cta.to || '/register'}>
              <Button variant="white" className="!rounded-full !px-7">
                {cta.label || 'Get Started Free'} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
