import { Link } from 'react-router-dom';
import { Map } from 'lucide-react';
import { PageHero } from '../../components/PageHero';

const sections = [
  {
    title: 'Public',
    links: [
      { to: '/', label: 'Home / Landing' },
      { to: '/features', label: 'Features' },
      { to: '/how-it-works', label: 'How It Works' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/testimonials', label: 'Testimonials' },
      { to: '/faq', label: 'FAQ' },
      { to: '/sitemap', label: 'Sitemap (this page)' },
    ],
  },
  {
    title: 'Authentication',
    links: [
      { to: '/login', label: 'Student Login' },
      { to: '/register', label: 'Student Registration / Sign Up' },
      { to: '/signup', label: 'Sign Up (alias)' },
      { to: '/forgot-password', label: 'Password Recovery' },
      { to: '/admin-login', label: 'Administrator Login' },
    ],
  },
  {
    title: 'Student App',
    links: [
      { to: '/app', label: 'Personalized Dashboard' },
      { to: '/app/transactions', label: 'Income & Expense Logging' },
      { to: '/app/categories', label: 'Manage Categories' },
      { to: '/app/budgets', label: 'Budget Goals & Alerts' },
      { to: '/app/reports', label: 'Monthly Reports' },
      { to: '/app/insights', label: 'AI Insights & Saving Tips' },
      { to: '/app/profile', label: 'Profile & CSV Import' },
    ],
  },
  {
    title: 'Admin Control Panel',
    links: [
      { to: '/admin', label: 'Admin Dashboard' },
      { to: '/admin/users', label: 'User Accounts' },
      { to: '/admin/categories', label: 'Default Categories' },
      { to: '/admin/announcements', label: 'Announcements / Tip Templates' },
      { to: '/admin/stats', label: 'Usage Statistics' },
    ],
  },
];

export default function Sitemap() {
  return (
    <div className="animate-fade-in min-h-[70vh]">
      <PageHero
        eyebrow="Sitemap"
        title="Application sitemap"
        subtitle="Complete navigation map of Campus Coin as required by the SRS — Public, Auth, Student, and Admin."
      />

      <section className="py-16 bg-cc-mint-soft">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Map className="w-6 h-6 text-cc-lime" />
            <p className="text-sm text-cc-muted">
              Jump between experiences using the links below. Amounts across the app are shown in PKR.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {sections.map((sec) => (
              <div key={sec.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-cc-forest text-lg mb-4 pb-2 border-b border-cc-mint">
                  {sec.title}
                </h2>
                <ul className="space-y-2.5">
                  {sec.links.map((l) => (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        className="text-sm text-cc-muted hover:text-cc-lime font-medium transition flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cc-lime" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
