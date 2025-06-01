import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

import logo from '../../../assets/images/logo.svg';
import instagram from '../../../assets/images/instagram.svg';
import telegram from '../../../assets/images/telegram.svg';
import email from '../../../assets/images/email.svg';


function Footer() {
    return (
        <footer className='footer'>
            <nav className='footer-nav container'>
                <div className='right-section'>
                    <Link to='/about'>Про нас</Link>
                    <Link to='studying'>Навчання</Link>
                    <Link to='games'>Ігри</Link>
                </div>

                <div className='left-section'>
                    <Link to='/blog'>Блог</Link>
                    <Link to='reviews'>Відгуки</Link>
                    <Link to='contacts'>Контакти</Link>
                </div>

                <div className='social-links'>
                    <a href="https://t.me/language_galaxy" className="social-link" target="_blank" rel="noopener noreferrer">
                        <img src={instagram}></img>
                        <span>language_galaxy</span>
                    </a>
                    <a href="https://instagram.com/language_galaxy" className="social-link" target="_blank" rel="noopener noreferrer">
                        <img src={telegram}></img>
                        <span>language_galaxy</span>
                    </a>
                    <a href="mailto:language_galaxy@gmail.com" className="social-link">
                        <img src={email}></img>
                        <span>language_galaxy@gmail.com</span>
                    </a>
                </div>

                <div className='logo'>
                    <img src={logo} alt="Language Galaxy" />
                    <span className="logo-text">Language Galaxy</span>
                </div>
            </nav>
        </footer>
    )
}

export default Footer;