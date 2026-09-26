import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] animate-fade-in flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl ${
        ok ? 'bg-cc-forest text-white' : 'bg-amber-800 text-white'
      }`}
    >
      {ok ? <CheckCircle2 className="w-5 h-5 text-cc-lime shrink-0" /> : <AlertCircle className="w-5 h-5 text-amber-200 shrink-0" />}
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
}
