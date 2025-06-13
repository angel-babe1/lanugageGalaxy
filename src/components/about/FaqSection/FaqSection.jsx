import React, { useState } from "react";
import { useTranslation } from "react-i18next"; 
import FaqQuestion from "../FaqQuestion/FaqQuestion.jsx";
import './FaqSection.css';

function FaqSection() {
    const { t } = useTranslation(); 
    const [openIndex, setOpenIndex] = useState(null);

    const faqTitle = t('faqSection.title');
    const faqData = t('faqSection.questions', { returnObjects: true });

    const handleToggle = (index) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    return (
        <section>
            <h2 className="faq-title">{faqTitle}</h2>
            <div className="faq-list">
                {Array.isArray(faqData) && faqData.map((item, index) => {
                    const isOpen = index === openIndex;

                    return (
                        <FaqQuestion
                            key={item.id}
                            question={item.question}
                            answer={item.answer}
                            isOpen={isOpen}
                            onToggle={handleToggle}
                            index={index}
                        />
                    )
                })}
            </div>
        </section>
    )
}

export default FaqSection;