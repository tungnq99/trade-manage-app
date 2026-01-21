import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './locales/vi.json';
import en from './locales/en.json';

// Get browser language or fallback to Vietnamese
const getBrowserLanguage = (): string => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('vi')) return 'vi';
    if (browserLang.startsWith('en')) return 'en';
    return 'vi'; // Default to Vietnamese
};

// Get saved language from localStorage or use browser language
const savedLanguage = localStorage.getItem('language') || getBrowserLanguage();

i18n
    .use(initReactI18next)
    .init({
        resources: {
            vi: { translation: vi },
            en: { translation: en }
        },
        lng: savedLanguage,
        fallbackLng: 'vi',
        interpolation: {
            escapeValue: false // React already escapes values
        }
    });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
});

export default i18n;
