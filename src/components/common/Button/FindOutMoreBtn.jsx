import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './FindOutMoreBtn.css'; 

const FindOutMoreBtn = ({ courseSlug, children }) => {
    const { t } = useTranslation();

    if (!courseSlug) {
        return (
            <button className="find-more-btn" disabled> 
                {children || t('buttons.findOutMore', 'Дізнатись більше')}
            </button>
        );
    }

    return (
        <Link to={`/courses/${courseSlug}`} className="find-more-btn">
            {children || t('buttons.findOutMore', 'Дізнатись більше')}
        </Link>
    );
};

export default FindOutMoreBtn;