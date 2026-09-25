import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  Target,
  BarChart3,
  Lightbulb,
  User,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  Type,
  Bookmark
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { Toast } from '../components/Toast';
import { useApp } from '../context/AppContext';
import api from '../api';

const links = [
  { to: '/app', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/app/categories', label: 'Categories', icon: Tags },
  { to: '/app/budgets', label: 'Budgets', icon: Target },
  { to: '/app/reports', label: 'Reports', icon: BarChart3 },
  { to: '/app/insights', label: 'Insights & Tips', icon: Lightbulb },
  { to: '/app/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/app/profile', label: 'Profile', icon: User },
];

export function StudentLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { profile, setProfile, setRole, darkMode, setDarkMode, fontSize, setFontSize } = useApp();

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    }
    setProfile(null);
    setRole('public');
    navigate('/');
  };

  const NavItems = () => (
    <>
      {links.map(({ to, end, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              isActive ? 'bg-cc-lime text-white shadow' : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <Icon className="w-4.5 h-4.5 w-5 h-5" />
          {label}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-cc-mint-soft">
      <RoleSwitcher />
      <div className="flex flex-1">
        <aside className="hidden lg:flex w-64 flex-col bg-cc-forest text-white shrink-0">
          <div className="p-5 border-b border-white/10">
            <Link to="/">
              <Logo dark />
            </Link>
            <p className="text-xs text-white/50 mt-2">Student Portal</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <NavItems />
          </nav>
          <div className="p-4 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 text-xs font-medium hover:bg-white/15"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                {darkMode ? 'Light' : 'Dark'}
              </button>
              <button
                type="button"
                onClick={() => setFontSize(fontSize === 'lg' ? 'md' : fontSize === 'md' ? 'sm' : 'lg')}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 text-xs font-medium hover:bg-white/15"
                title="Font size"
              >
                <Type className="w-3.5 h-3.5" />
                {fontSize.toUpperCase()}
              </button>
            </div>
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button type="button" className="lg:hidden p-2 rounded-lg hover:bg-cc-mint" onClick={() => setOpen(!open)}>
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="lg:hidden">
                <Logo size="sm" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-cc-muted">Breadcrumb</p>
                <p className="text-sm font-semibold text-cc-forest">Student / App</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="" className="w-9 h-9 rounded-full ring-2 ring-cc-mint object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full ring-2 ring-cc-mint bg-cc-lime flex items-center justify-center text-white font-bold text-sm">
                  {profile?.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-cc-forest leading-tight">{profile?.name || 'Student'}</p>
                <p className="text-[11px] text-cc-muted">{profile?.academicYear || profile?.email || ''}</p>
              </div>
            </div>
          </header>

          {open && (
            <div className="lg:hidden bg-cc-forest p-4 space-y-1 animate-fade-in">
              <NavItems />
              <button type="button" onClick={logout} className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm text-white/70">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <Toast />
    </div>
  );
}
