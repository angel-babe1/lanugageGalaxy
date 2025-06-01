import React from "react";
import './IconWithLabel.css';
import { Link } from "react-router-dom";

function IconWithLabel({ flag, language, languageId }) {
    const linkTo = `/studying/${languageId}`;

    return (
        <Link to={linkTo} className="icon-link">
            <div className="icon-with-label">
                <div className="icon-circle">
                    <img src={flag} alt={`${language} flag`} />
                </div>
                <span className="icon-label">{language}</span>
            </div>
        </Link>
    )
}

export default IconWithLabel;