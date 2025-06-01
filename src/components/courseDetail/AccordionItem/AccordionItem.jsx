import React, { useState } from 'react';
import './AccordionItem.css'; 

const AccordionItem = ({ moduleTitle, lessons, initiallyOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initiallyOpen);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <button className="accordion-title" onClick={toggleOpen}>
                {moduleTitle}
                <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
                <div className="accordion-content">
                    <ul>
                        {lessons.map((lesson, index) => (
                            <li key={index}>{lesson.title}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AccordionItem;