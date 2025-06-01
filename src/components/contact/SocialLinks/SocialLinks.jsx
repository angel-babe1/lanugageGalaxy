import React from "react";
import { mainContacts } from "../../../data/contactsData";
import './SocialLinks.css';

import telegramIcon from '../../../assets/images/telegramBlack.png';
import instagramIcon from '../../../assets/images/instagramBlack.png';
import emailIcon from '../../../assets/images/emailBlack.png';

function SocialLinks() {
    return (
        <div className="social-links-container">
            <a href={mainContacts.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="social-link">
                <img src={telegramIcon} alt="Telegram" className="social-link-icon"/>
            </a>
            <a href={mainContacts.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
                <img src={instagramIcon} alt="Telegram" className="social-link-icon"/>
            </a>
            <a href={mainContacts.email} target="_blank" rel="noopener noreferrer" aria-label="Email" className="social-link">
                <img src={emailIcon} alt="Telegram" className="social-link-icon"/>
            </a>
        </div>
    )
}

export default SocialLinks;