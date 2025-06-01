import React from 'react';
import './FeatureCard.css';

function FeatureCard({ imageSrc, imageAlt, description }) {
  return (
    <div className="feature-card">
      <img src={imageSrc} alt={imageAlt} className="card-image" />
      <p className="feature-description">{description}</p>
    </div>
  );
}

export default FeatureCard;