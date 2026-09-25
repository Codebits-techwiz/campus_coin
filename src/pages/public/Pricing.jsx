import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';
import { PageHero } from '../../components/PageHero';

const planDefs = [
  { id: 'starter', price: 'Rs 0', highlight: false },
  { id: 'student', price: 'Rs 499', highlight: true },
  { id: 'pro', price: 'Rs 999', highlight: false },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in min-h-[70vh]">
      <PageHero
        eyebrow={t('pricing.eyebrow')}
        title={t('pricing.title')}
        subtitle={t('pricing.subtitle')}
      />

      <section className="py-16 sm:py-20 bg-cc-mint-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {planDefs.map((plan) => {
              const badge = t(`pricing.plans.${plan.id}.badge`);
              const perks = t(`pricing.plans.${plan.id}.perks`, { returnObjects: true });
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-3xl p-7 sm:p-8 flex flex-col ${
                    plan.highlight
                      ? 'border-2 border-cc-lime/50 shadow-xl md:-translate-y-1'
                      : 'border border-gray-100 shadow-sm'
                  }`}
                >
                  {badge ? (
                    <div
                      className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full ${
                        plan.highlight ? 'bg-cc-lime text-white' : 'bg-cc-mint text-cc-forest'
                      }`}
                    >
                      {badge}
                    </div>
                  ) : null}
                  <p className="text-sm font-bold text-cc-lime uppercase tracking-wide pr-20">
                    {t(`pricing.plans.${plan.id}.name`)}
                  </p>
                  <p className="mt-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-cc-forest">{plan.price}</span>
                    <span className="text-cc-muted ml-2 text-sm">{t(`pricing.plans.${plan.id}.period`)}</span>
                  </p>
                  <ul className="mt-7 space-y-3 flex-1">
                    {(Array.isArray(perks) ? perks : []).map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-cc-ink font-medium">
                        <Check className="w-5 h-5 text-cc-lime shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.highlight ? 'primary' : 'outline'}
                    className="w-full !rounded-full mt-8 !py-3.5"
                    onClick={() => navigate('/register')}
                  >
                    {t(`pricing.plans.${plan.id}.cta`)} <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
