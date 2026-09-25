export function Logo({ className = '', dark = false, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' };
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${sizes[size]} relative shrink-0`}>
        <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden>
          <circle cx="24" cy="24" r="22" fill={dark ? '#5CB85C' : '#0B3D2E'} />
          <circle cx="24" cy="24" r="15" fill="#F5C518" />
          <circle cx="24" cy="24" r="10" fill="#5CB85C" />
          <text x="24" y="28" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0B3D2E">$</text>
        </svg>
      </div>
      <span className={`${textSizes[size]} font-extrabold tracking-tight ${dark ? 'text-white' : 'text-cc-forest'}`}>
        Campus<span className={dark ? 'text-cc-lime' : 'text-cc-lime'}>Coin</span>
      </span>
    </div>
  );
}
