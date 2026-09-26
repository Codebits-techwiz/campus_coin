export function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cc-lime focus-visible:ring-offset-2 disabled:opacity-50';
  const variants = {
    primary: 'bg-cc-forest text-white hover:bg-cc-forest-light px-5 py-2.5 shadow-md',
    lime: 'bg-cc-lime text-white hover:bg-cc-lime-dark px-5 py-2.5 shadow-md',
    outline:
      'bg-white text-cc-forest border-2 border-cc-forest/20 hover:border-cc-lime hover:text-cc-lime px-5 py-2.5',
    ghost: 'text-cc-forest hover:bg-cc-mint px-4 py-2',
    white: 'bg-white text-cc-forest hover:bg-cc-mint px-5 py-2.5 shadow-md font-bold',
    danger: 'bg-red-600 text-white hover:bg-red-700 px-5 py-2.5',
  };
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
