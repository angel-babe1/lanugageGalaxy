import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Импортируем наши файлы с переводами
import translationEN from './locales/en/translation.json';
import translationUA from './locales/ua/translation.json';

const resources = {
    en: {
        translation: translationEN
    },
    ua: {
        translation: translationUA
    }
};

i18n
    .use(LanguageDetector) // Используем детектор языка браузера
    .use(initReactI18next) // Передаем i18n в react-i18next
    .init({
        resources,
        fallbackLng: 'ua', // Язык по умолчанию, если другой не определен
        interpolation: {
            escapeValue: false, // React уже защищает от XSS
        },
        detection: {
            // порядок, в котором i18next будет искать язык:
            order: ['localStorage', 'navigator'],
            // ключ, по которому язык будет сохраняться в localStorage
            lookupLocalStorage: 'i18nextLng',
            // кешировать ли выбранный язык
            caches: ['localStorage']
        },
        // Раскомментируйте для отладки в консоли
        // debug: true,
    });

export default i18n;