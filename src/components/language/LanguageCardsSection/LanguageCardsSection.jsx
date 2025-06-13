import React from "react";
import { useTranslation } from "react-i18next"; // <-- 1. Импортируем хук
import IconWithLabel from "../../common/IconWithLabel/IconWithLabel";
import './LanguageCardsSection.css';

import enFlag from '../../../assets/images/enFlag.svg';
import zhFlag from '../../../assets/images/zhFlag.svg';
import koFlag from '../../../assets/images/koFlag.svg';
import jaFlag from '../../../assets/images/jaFlag.svg';

const languageData = [
    { id: 'en', flag: enFlag, key: 'english' },
    { id: 'zh', flag: zhFlag, key: 'chinese' },
    { id: 'ko', flag: koFlag, key: 'korean' },
    { id: 'ja', flag: jaFlag, key: 'japanese' }
];

function LanguageCardsSection() {
    const { t } = useTranslation();

    const languages = languageData.map(lang => ({
        id: lang.id,
        flag: lang.flag,
        name: t(`header.submenu.${lang.key}`)
    }));

    return (
        <div className="language-cards">
            {languages.map((lang) => (
                <IconWithLabel
                    key={lang.id}
                    language={lang.name}
                    flag={lang.flag}
                    languageId={lang.id}
                />
            ))}
        </div>
    );
}

export default LanguageCardsSection;