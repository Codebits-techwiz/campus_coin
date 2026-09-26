import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ur from './locales/ur.json';

const savedLang = localStorage.getItem('cc-lang') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ur: { translation: ur },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export function applyDocumentLang(lng) {
  const lang = lng || i18n.language || 'en';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
  localStorage.setItem('cc-lang', lang);
}

applyDocumentLang(savedLang);

i18n.on('languageChanged', applyDocumentLang);

export default i18n;
