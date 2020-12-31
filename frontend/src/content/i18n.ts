import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const debug: boolean = process.env.NODE_ENV === "development";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        translation: {
            variable: "Variables",
        },
    },
    fr: {
        translation: {
            variable: "French variables",
        },
    },
    pt: {
        translation: {
            variable: "Portuguese variables",
        },
    },
};

i18n
    // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-http-backend
    // .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        resources,
        fallbackLng: 'pt',
        debug,
        load: 'languageOnly',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });

export default i18n;