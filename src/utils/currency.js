
export function formatPkr(amount, { signed = false, decimals = 0 } = {}) {
  const n = Number(amount);
  const value = Number.isFinite(n) ? n : 0;
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(abs);

  if (signed) {
    const sign = value > 0 ? '+' : value < 0 ? '−' : '';
    return `${sign}Rs ${formatted}`;
  }
  if (value < 0) return `−Rs ${formatted}`;
  return `Rs ${formatted}`;
}

export function formatPkrCompact(amount) {
  const n = Math.abs(Number(amount) || 0);
  if (n >= 1_000_000) {
    return `Rs ${(n / 1_000_000).toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `Rs ${Math.round(n / 1_000)}k`;
  }
  return formatPkr(n);
}
