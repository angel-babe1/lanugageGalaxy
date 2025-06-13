import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

import uaIcon from '../../../assets/images/ua.svg';
import enIcon from '../../../assets/images/en.svg';

const languages = {
    ua: { nativeName: 'UA', icon: uaIcon },
    en: { nativeName: 'EN', icon: enIcon },
};

function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const currentLangInfo = languages[currentLanguage] || languages['ua'];

    return (
        <div className="language-switcher">
            <div className="current-language-display">
                <img src={currentLangInfo.icon} alt={currentLangInfo.nativeName} />
                <span>{currentLangInfo.nativeName}</span>
            </div>

            <div className="language-options">
                {Object.keys(languages)
                    .filter((lng) => lng !== currentLanguage) 
                    .map((lng) => {
                        const langInfo = languages[lng];
                        return (
                            <button key={lng} onClick={() => changeLanguage(lng)}>
                                <img src={langInfo.icon} alt={langInfo.nativeName} />
                                <span>{langInfo.nativeName}</span>
                            </button>
                        );
                    })}
            </div>
        </div>
    );
}

export default LanguageSwitcher;