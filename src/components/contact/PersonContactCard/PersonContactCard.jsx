import React from "react";
import './PersonContactCard.css';

function PersonContactCard({ name, title, photoSrc, description, contact, reverseOrder = false }) {

    const cardClasses = `contact-card ${reverseOrder ? 'reverse' : ''}`;
    const photoContainerClasses = "contact-card-photo-container";
    const infoContainerClasses = "contact-card-info-container";

    return (
        <div className={cardClasses}>
            <div className={photoContainerClasses}>
                <img src={photoSrc} alt={name} className="contact-card-photo" />
                <div className="contact-card-title-group">
                    <h3 className="contact-card-name">{name}</h3>
                    {contact && (
                        <a
                            href={contact.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-card-link title-contact-link"
                            aria-label={`Contact ${name} via ${contact.type || 'link'}`}
                        >
                            <img src={contact.iconSrc} alt={contact.type || 'contact'} className="contact-card-icon title-contact-icon" />
                        </a>
                    )}
                </div>
                <p className="contact-card-title">{title}</p>
            </div>

            <div className={infoContainerClasses}>
                <p className="contact-card-description">{description}</p>
            </div>
        </div>
    )
}

export default PersonContactCard;