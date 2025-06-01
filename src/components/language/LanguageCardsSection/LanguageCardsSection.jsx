import React from "react";
import IconWithLabel from "../../common/IconWithLabel/IconWithLabel";
import './LanguageCardsSection.css';

import flag from '../../../assets/images/flag.svg';


function LanguageCardsSection() {
    const languages = [
        { id: 'en', name: 'English', flag: flag },      
        { id: 'zh', name: 'Chinese', flag: flag },      
        { id: 'ko', name: 'Korean', flag: flag },     
        { id: 'ja', name: 'Japanese', flag: flag }
    ];

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
    )
}

export default LanguageCardsSection;