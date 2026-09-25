import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Wallet,
  LayoutGrid,
  Sparkles,
  BarChart3,
  Lightbulb,
  Smartphone,
} from 'lucide-react';
import { Button } from '../../components/Button';
import { PageHero } from '../../components/PageHero';
import { features } from '../../data/mockData';

const iconMap = {
  wallet: Wallet,
  layout: LayoutGrid,
  sparkles: Sparkles,
  chart: BarChart3,
  lightbulb: Lightbulb,
  smartphone: Smartphone,
};

export default function Features() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in min-h-[70vh]">
      <PageHero
        eyebrow="Features"
        title="Everything you need to manage campus money"
        subtitle="From quick logging in PKR to AI insights — one place for the full student money loop."
        cta={{ to: '/register', label: 'Get Started Free' }}
      />

      <section className="py-16 sm:py-20 bg-cc-mint-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = iconMap[f.icon];
              return (
                <div
                  key={f.title}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-cc-lime/30 hover:-translate-y-0.5 transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cc-mint text-cc-lime flex items-center justify-center mb-4 group-hover:bg-cc-lime group-hover:text-white transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-cc-forest mb-2">{f.title}</h2>
                  <p className="text-sm text-cc-muted leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button className="!rounded-full !px-7" onClick={() => navigate('/register')}>
              Start tracking in PKR <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
