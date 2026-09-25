import { Outlet } from 'react-router-dom';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Toast } from '../components/Toast';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <RoleSwitcher />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  );
}
