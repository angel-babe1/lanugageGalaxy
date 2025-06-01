import React, { useState } from "react";
import faqData from "../../../data/faq.json";
import FaqQuestion from "../FaqQuestion/FaqQuestion.jsx";

import './FaqSection.css';

function FaqSection() {

    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    return (
        <section>
            <h2 className="faq-title">Frequently asked questions</h2>
            <div className="faq-list">
                {faqData.map((item, index) => {
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