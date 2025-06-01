import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../content/AuthContext';
import { useCart } from '../../../content/CartContext';
import './Header.css';

import logo from '../../../assets/images/logo.svg';
import cart from '../../../assets/images/cart.svg';
import language from '../../../assets/images/ua.svg';
// import CartItem from '../../cart/CartItem/CartItem';

function Header() {
    const { currentUser, logout, loadingAuthState } = useAuth();
    const { cartItems, getTotalItems, clearCart} = useCart();
    const navigate = useNavigate();

    const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
    const [isStudyingMenuOpen, setIsStudyingMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            // if (currentUser) {
            //     await clearCart();                
            // }
            await logout();
            navigate('/signin'); // Редирект на страницу входа после выхода
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
                <nav className="header-nav">
                    <div className='logo'>
                        <Link to='/'><img src={logo} alt="logo" /></Link>
                        <Link to="/">Language Galaxy</Link>
                    </div>
                    <div className='menu'>
                        <ul>
                            <li
                                onMouseEnter={() => setIsAboutMenuOpen(true)}
                                onMouseLeave={() => setIsAboutMenuOpen(false)}
                            >
                                <Link to="/about">Про нас</Link>
                                {isAboutMenuOpen && (
                                    <div className="submenu">
                                        <Link to="/teachers">Учителя</Link>
                                        <Link to="/reviews">Отзывы</Link>
                                        <Link to="/faq">FAQ</Link>
                                    </div>
                                )}
                            </li>
                            <li
                                onMouseEnter={() => setIsStudyingMenuOpen(true)}
                                onMouseLeave={() => setIsStudyingMenuOpen(false)}
                            >
                                <Link to="/studying">Навчання</Link>
                                {isStudyingMenuOpen && (
                                    <div className="submenu">
                                        <Link to="/studying/en">Англійська</Link>
                                        <Link to="/studying/zh">Китайська</Link>
                                        <Link to="/studying/ko">Корейська</Link>
                                        <Link to="/studying/ja">Японська</Link>
                                    </div>
                                )}
                            </li>
                            <li><Link to="/blog">Блог</Link></li>
                            <li><Link to="/games">Ігри</Link></li>
                            <li><Link to="/contacts">Контакти</Link></li>
                        </ul>
                    </div>
                    <div className="menu-actions">
                        {currentUser ? (
                            <>
                                {/* <span className='user-greeting'>
                                    Hi, {currentUser.displayName || currentUser.email}!
                                </span> */}
                                <button onClick={handleLogout} className='auth-button logout-button'>
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to='/registrate' className='auth-button signup-button'>Sign Up</Link>
                            </>
                        )}
                        <div className="cart">
                            <Link to="/cart" className='cart-link-header'>
                                <img src={cart} alt="cart" />
                                {totalCartItems > 0 && (
                                    <span className='cart-count-badge'>{totalCartItems}</span>
                                )}
                            </Link>

                        </div>
                        <div className="change-language">
                            <img src={language} alt="ua" />
                            <p>ua</p>
                        </div>
                    </div>

                </nav>
            </div>

        </header>
    )
}

export default Header;