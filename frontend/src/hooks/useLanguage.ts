import { useTranslation } from 'react-i18next';

/**
 * Language Toggle Hook
 * Provides current language and toggle function
 */
export const useLanguage = () => {
    const { i18n } = useTranslation();

    const currentLanguage = i18n.language;

    const toggleLanguage = () => {
        const newLang = currentLanguage === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(newLang);
    };

    const setLanguage = (lang: 'vi' | 'en') => {
        i18n.changeLanguage(lang);
    };

    return {
        currentLanguage,
        toggleLanguage,
        setLanguage,
        isVietnamese: currentLanguage === 'vi',
        isEnglish: currentLanguage === 'en'
    };
};
