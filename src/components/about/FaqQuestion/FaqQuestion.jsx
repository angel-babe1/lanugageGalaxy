import React from "react";
import './FaqQuestion.css';

function FaqQuestion({ question, answer, isOpen, onToggle, index }) {

    const handleClick = (event) => {
        event.preventDefault();
        onToggle(index);
    };

    return (
        <details className="faq-item" open={isOpen}>
            <summary
                className="faq-question"
                onClick={handleClick}
            >
                {question}
            </summary>
            <div className="faq-answer">
                <p>{answer}</p>
            </div>
        </details>
    )
}

export default FaqQuestion;