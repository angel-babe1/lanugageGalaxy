import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';

import logo from '../../../assets/images/logo.svg';
import instagram from '../../../assets/images/instagram.svg';
import telegram from '../../../assets/images/telegram.svg';
import email from '../../../assets/images/email.svg';


function Footer() {
    const { t } = useTranslation();

    return (
        <footer className='footer'>
            <nav className='footer-nav container'>
                <div className='right-section'>
                    <Link to='/about'>{t('footer.nav.about')}</Link>
                    <Link to='/studying'>{t('footer.nav.courses')}</Link>
                    <Link to='/games'>{t('footer.nav.games')}</Link>
                </div>

                <div className='left-section'>
                    <Link to='/blog'>{t('footer.nav.blog')}</Link>
                    <Link to='/reviews'>{t('footer.nav.reviews')}</Link>
                    <Link to='/contacts'>{t('footer.nav.contact')}</Link>
                </div>

                <div className='social-links'>
                    <a href="https://t.me/language_galaxy" className="social-link" target="_blank" rel="noopener noreferrer">
                        <img src={instagram} alt="Instagram" />
                        <span>language_galaxy</span>
                    </a>
                    <a href="https://instagram.com/language_galaxy" className="social-link" target="_blank" rel="noopener noreferrer">
                        <img src={telegram} alt="Telegram" />
                        <span>language_galaxy</span>
                    </a>
                    <a href="mailto:language_galaxy@gmail.com" className="social-link">
                        <img src={email} alt="Email" />
                        <span>language_galaxy@gmail.com</span>
                    </a>
                </div>

                <div className='logo'>
                    <img src={logo} alt={t('footer.logoAlt')} />
                    <span className="logo-text">{t('footer.logoText')}</span>
                </div>
            </nav>
        </footer>
    )
}

export default Footer;