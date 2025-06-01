import React from "react";
import './CourseAboutSection.css';

const CourseAboutSection = ({ fullDescription, duration, includedItems }) => {
    return (
        <section className="course-about-section">
            <hr className="section-divider-top" />
            <div className="about-content-grid">
                <div className="description-column">
                    <h2>Про курс</h2>
                    <p>{fullDescription}</p>
                    {duration && <p><strong>Тривалість курсу:</strong> {duration}</p>}
                </div>
                {includedItems && includedItems.length > 0 && (
                    <div className="included-column">
                        <h2>Що входить в курс</h2>
                        <ul className="included-list">
                            {includedItems.map(item => (
                                <li key={item.id}>
                                    <span className="checkmark">✓</span>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    )
}

export default CourseAboutSection;