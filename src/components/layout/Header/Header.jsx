import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../content/AuthContext';
import { useCart } from '../../../content/CartContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../common/LanguageSwitcher/LanguageSwitcher';
import logo from '../../../assets/images/logo.svg';
import cart from '../../../assets/images/cart.svg';
import './Header.css';

function Header() {
    const { t } = useTranslation();
    const { currentUser, logout, loadingAuthState } = useAuth();
    const { getTotalItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
    const [isStudyingMenuOpen, setIsStudyingMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/signin');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const totalCartItems = getTotalItems();

    if (loadingAuthState) {
        return (
            <header className='header'>
                <div className="container">
                    <div className='logo'>
                        <Link to='/'><img src={logo} alt="logo" /></Link>
                        <Link to="/">Language Galaxy</Link>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className='header'>
            <div className="container">
                <nav className={`header-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <div className='logo'>
                        <Link to='/'><img src={logo} alt={t('footer.logoAlt')} /></Link>
                        <Link to="/">Language Galaxy</Link>
                    </div>

                    <div className="menu">
                        <ul>
                            <li
                                onMouseEnter={() => !isMobileMenuOpen && setIsAboutMenuOpen(true)}
                                onMouseLeave={() => !isMobileMenuOpen && setIsAboutMenuOpen(false)}
                                onClick={() => isMobileMenuOpen && setIsAboutMenuOpen(!isAboutMenuOpen)}
                            >
                                <Link to="/about">{t('header.about')}</Link>
                                {(isAboutMenuOpen || isMobileMenuOpen) && (
                                    <div className="submenu">
                                        <Link to="/teachers">{t('header.submenu.teachers')}</Link>
                                        <Link to="/reviews">{t('header.submenu.reviews')}</Link>
                                        <Link to="/faq">{t('header.submenu.faq')}</Link>
                                    </div>
                                )}
                            </li>
                            <li
                                onMouseEnter={() => !isMobileMenuOpen && setIsStudyingMenuOpen(true)}
                                onMouseLeave={() => !isMobileMenuOpen && setIsStudyingMenuOpen(false)}
                                onClick={() => isMobileMenuOpen && setIsStudyingMenuOpen(!isStudyingMenuOpen)}
                            >
                                <Link to="/studying">{t('header.courses')}</Link>
                                {(isStudyingMenuOpen || isMobileMenuOpen) && (
                                    <div className="submenu">
                                        <Link to="/studying/en">{t('header.submenu.english')}</Link>
                                        <Link to="/studying/zh">{t('header.submenu.chinese')}</Link>
                                        <Link to="/studying/ko">{t('header.submenu.korean')}</Link>
                                        <Link to="/studying/ja">{t('header.submenu.japanese')}</Link>
                                    </div>
                                )}
                            </li>
                            <li><Link to="/blog">{t('header.blog')}</Link></li>
                            <li><Link to="/games">{t('header.games')}</Link></li>
                            <li><Link to="/contacts">{t('header.contact')}</Link></li>
                        </ul>
                    </div>

                    <div className="menu-actions">
                        {currentUser ? (
                            <button onClick={handleLogout} className='auth-button logout-button'>
                                {t('header.signOut')}
                            </button>
                        ) : (
                            <Link to='/registrate' className='auth-button signup-button'>{t('header.signUp')}</Link>
                        )}
                        <div className="cart">
                            <Link to="/cart" className='cart-link-header'>
                                <img src={cart} alt="cart" />
                                {totalCartItems > 0 && (
                                    <span className='cart-count-badge'>{totalCartItems}</span>
                                )}
                            </Link>
                        </div>
                        <LanguageSwitcher />
                    </div>

                    <div className="mobile-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;