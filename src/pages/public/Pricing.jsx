import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '../../components/Button';
import { PageHero } from '../../components/PageHero';

const perks = [
  'Unlimited transactions in PKR',
  'Budgets & alerts',
  'AI category suggestions',
  'Reports & insights',
  'Mobile-friendly web app',
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in min-h-[70vh]">
      <PageHero
        eyebrow="Pricing"
        title="Simple. Student-friendly. Free."
        subtitle="Start tracking today in Pakistani Rupees — no credit card, no trial countdown."
      />

      <section className="py-16 sm:py-20 bg-cc-mint-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto bg-white rounded-3xl border-2 border-cc-lime/40 shadow-xl p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wide bg-cc-lime text-white px-3 py-1 rounded-full">
              Most popular
            </div>
            <p className="text-sm font-bold text-cc-lime uppercase tracking-wide">Student Free</p>
            <p className="mt-2">
              <span className="text-5xl font-extrabold text-cc-forest">Rs 0</span>
              <span className="text-cc-muted ml-2">/ forever</span>
            </p>
            <ul className="mt-8 space-y-3">
              {perks.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-cc-ink font-medium">
                  <Check className="w-5 h-5 text-cc-lime shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Button className="w-full !rounded-full mt-8 !py-3.5" onClick={() => navigate('/register')}>
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
