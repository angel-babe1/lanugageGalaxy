import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './FindOutMoreBtn.css';

const FindOutMoreBtn = ({ courseSlug, to, children }) => {
    const { t } = useTranslation();

    let finalPath = '';
    if (to) {
        finalPath = to;
    } else if (courseSlug) {
        finalPath = `/courses/${courseSlug}`;
    }

    const buttonText = children || t('buttons.findOutMore', 'Дізнатись більше');

    if (!finalPath) {
        return (
            <button className="find-more-btn" disabled>
                {buttonText}
            </button>
        );
    }

    return (
        <Link to={finalPath} className="find-more-btn">
            {buttonText}
        </Link>
    );
};

export default FindOutMoreBtn;