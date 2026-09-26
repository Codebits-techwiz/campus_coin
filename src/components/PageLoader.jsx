import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';

export function PageLoader({ label }) {
  const { t } = useTranslation();
  const text = label || t('common.loading');

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-cc-mint-soft/95 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className="flex flex-col items-center gap-4 px-6 w-full max-w-xs">
        <div className="relative w-full overflow-hidden rounded-2xl bg-white border border-cc-mint shadow-[0_12px_40px_-12px_rgba(11,61,46,0.28)] animate-loader-slide">
          <div className="flex items-center justify-center gap-3 px-8 py-6">
            <Logo size="md" />
          </div>

          <div className="h-1 w-full bg-cc-mint overflow-hidden">
            <div className="h-full w-2/5 rounded-full bg-linear-to-r from-cc-lime via-cc-forest to-cc-lime animate-loader-run" />
          </div>

          <div className="pointer-events-none absolute inset-0 animate-loader-shine bg-linear-to-r from-transparent via-white/50 to-transparent" />
        </div>

        <p className="text-sm font-semibold text-cc-forest tracking-tight">{text}</p>
      </div>
    </div>
  );
}

export function RouteLoader() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const hide = window.setTimeout(() => setVisible(false), 650);
    return () => window.clearTimeout(hide);
  }, [pathname]);

  if (!visible) return null;

  return <PageLoader />;
}
