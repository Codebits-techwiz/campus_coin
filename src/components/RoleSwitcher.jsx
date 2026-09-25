import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function RoleSwitcher() {
  const { role, switchRole } = useApp();
  const navigate = useNavigate();

  const go = (r) => {
    switchRole(r);
    if (r === 'public') navigate('/');
    else if (r === 'student') navigate('/app');
    else navigate('/admin');
  };

  const btn = (r, label) => (
    <button
      key={r}
      type="button"
      onClick={() => go(r)}
      className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
        role === r ? 'bg-cc-lime text-white shadow' : 'bg-black/30 text-white/70 hover:bg-black/50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-cc-forest text-white text-xs py-2 px-4 flex flex-wrap justify-between items-center gap-2 border-b border-cc-forest-light">
      <div className="flex items-center gap-3">
        <span className="font-bold tracking-wider text-cc-lime uppercase">Campus Coin Platform</span>
        <span className="text-white/40 hidden sm:inline">|</span>
        <span className="hidden sm:inline text-white/70">Student Budget & Expense Tracker — End-to-End Web Solutions</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-white/70 font-medium">Demo Persona:</span>
        {btn('public', 'Public')}
        {btn('student', 'Student')}
        {btn('admin', 'Admin')}
      </div>
    </div>
  );
}
