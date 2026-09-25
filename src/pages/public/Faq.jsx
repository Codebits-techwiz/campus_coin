import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHero } from '../../components/PageHero';
import { faqItems } from '../../data/mockData';

export default function Faq() {
  const [openFaq, setOpenFaq] = useState(0);
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in min-h-[70vh]">
      <PageHero
        eyebrow={t('faqPage.eyebrow')}
        title={t('faqPage.title')}
        subtitle={t('faqPage.subtitle')}
      />

      <section className="py-16 sm:py-20 bg-cc-mint-soft">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-cc-forest"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  {t(item.qKey)}
                  <ChevronDown
                    className={`w-5 h-5 text-cc-lime transition shrink-0 ml-3 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-cc-muted leading-relaxed animate-fade-in">
                    {t(item.aKey)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
