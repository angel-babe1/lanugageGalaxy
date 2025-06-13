import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import FeatureCard from '../FeatureCard/FeatureCard';
import featuresData from '../../../data/features.json';
import './FeaturesCarousel.css';

const imageModules = import.meta.glob('../../../assets/images/*png', { eager: true });

function getImageUrl(filename) {
  const path = `../../../assets/images/${filename}`;

  if (imageModules[path]) {
    return imageModules[path].default;
  }
  else {
    console.warn(`Image module not found for filename ${filename} using path key: ${path}. Available keys:`, Object.keys(imageModules));
    return '';
  }
};

function FeaturesCarousel() {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3;
  const slideWidthPercentage = 100 / itemsToShow;

  const translatedCards = t('featuresSection.cards', { returnObjects: true });

  const mergedFeaturesData = useMemo(() => {
    return featuresData.map(feature => {
      const translatedFeature = translatedCards.find(tFeature => tFeature.id === feature.id) || {};
      return {
        ...feature,
        ...translatedFeature,
      };
    });
  }, [i18n.language]);


  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? 0 : prevIndex - 1
    );
  };

  const handleNext = () => {
    const lastPossibleIndex = Math.max(0, mergedFeaturesData.length - itemsToShow);
    setCurrentIndex((prevIndex) =>
      prevIndex >= lastPossibleIndex ? lastPossibleIndex : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    const lastPossibleIndex = Math.max(0, mergedFeaturesData.length - itemsToShow);
    setCurrentIndex(Math.min(index, lastPossibleIndex));
  };

  const translateXValue = useMemo(() => {
    return currentIndex * slideWidthPercentage;
  }, [currentIndex, slideWidthPercentage]);

  const lastPossibleIndex = Math.max(0, mergedFeaturesData.length - itemsToShow);

  const numberOfDots = lastPossibleIndex + 1;

  return (
    <section className="features-section">
      <h2 className='carousel-title'>{t('featuresSection.title')}</h2>
      <div className="carousel">
        <button
          onClick={handlePrev}
          className='featuresCarousel-arrow arrow-left'
          disabled={currentIndex === 0}
        >
          ←
        </button>
        <div className="featuresCarousel-window">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${translateXValue}%)` }}
          >
            {mergedFeaturesData.map((feature) => (
              <div className="carousel-slide" key={feature.id}>
                <FeatureCard
                  imageSrc={getImageUrl(feature.image)}
                  imageAlt={feature.alt}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleNext}
          className='featuresCarousel-arrow arrow-right'
          disabled={currentIndex >= lastPossibleIndex}
        >
          →
        </button>
      </div>

      <div className="featuresCarousel-pagination">
        {Array.from({ length: numberOfDots }).map((_, index) => {
          const isActive = index === currentIndex;
          const dotClasses = `featuresCarousel-dot ${isActive ? 'active' : ''}`;
          const ariaLabel = mergedFeaturesData[index] ? mergedFeaturesData[index].alt : `Go to slide ${index + 1}`;

          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={dotClasses}
              aria-label={ariaLabel}
            />
          )
        })}
      </div>
    </section>
  );
}

export default FeaturesCarousel;