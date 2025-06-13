import React from 'react';
import { useTranslation } from 'react-i18next';
import './CourseDetailHeader.css';

const CourseDetailHeader = ({ title, coverImage, shortDescription, price, onPurchase }) => {
  const { t } = useTranslation();

  return (
    <header className="course-detail-header">
      <div className="course-detail-cover-image-container">
        {coverImage && <img src={coverImage} alt={title} className="course-detail-cover-image" />}
      </div>
      <div className="course-intro-section">
        <h1>{title}</h1>
        {shortDescription && <p className="course-detail-short-description">{shortDescription}</p>}
        <div className="course-price">
          <h2>{t('courseDetailsPage.priceLabel')} {price}</h2>
          <button onClick={onPurchase} className="purchase-button">{t('courseDetailsPage.purchaseButton')}</button>
        </div>
      </div>
    </header>
  );
};

export default CourseDetailHeader;