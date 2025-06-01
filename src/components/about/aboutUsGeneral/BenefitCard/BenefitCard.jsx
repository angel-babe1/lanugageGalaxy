import React from "react";
import './BenefitCard.css';

function BenefitCard ({title, description, className = ''}) {
    const cardClasses = `benefit-card ${className}`;
    return (
        <div className={cardClasses}>
            <h3 className="benefit-card-title">{title}</h3>
            <p className="benefit-card-description">{description}</p>
        </div>
    )
}

export default BenefitCard;