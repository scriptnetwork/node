import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEnglish from './locales/english.json';
import translationFrench from './locales/french.json';
import translationGerman from './locales/german.json';
import translationSpanish from './locales/spanish.json';

const resources = {
    english: {
        translation: translationEnglish,
    },
    french: {
        translation: translationFrench
    },
    german: {
        translation: translationGerman
    },
    spanish: {
        translation: translationSpanish
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "english", //default language
        keySeparator: false,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
