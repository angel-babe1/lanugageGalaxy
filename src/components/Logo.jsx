import React from 'react';
import './Logo.css';

import logo from '../assets/images/logo.svg';

function Logo() {
    return (
        <div className={`logo-container ${size} ${className}`}>
            <img src={logo} alt="Language Galaxy Logo" className="logo-image" />
            <h1 className="logo-text">Language Galaxy</h1>
        </div>
    );
};

export default Logo; 