import React, { useState, useMemo, useEffect } from 'react';
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
  return '';
}

function FeaturesCarousel() {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const getItemsToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 600) return 1;
      if (window.innerWidth < 992) return 2;
    }
    return 3;
  };

  const [itemsToShow, setItemsToShow] = useState(getItemsToShow());

  useEffect(() => {
    const handleResize = () => {
      const newItemsToShow = getItemsToShow();
      setItemsToShow(newItemsToShow);
      setCurrentIndex(0); 
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const translatedCards = t('featuresSection.cards', { returnObjects: true });

  const mergedFeaturesData = useMemo(() => {
    if (!Array.isArray(translatedCards)) return [];
    return featuresData.map(feature => {
      const translatedFeature = translatedCards.find(tFeature => tFeature.id === feature.id) || {};
      return {
        ...feature,
        ...translatedFeature,
      };
    });
  }, [i18n.language, translatedCards]);

  const lastPossibleIndex = Math.max(0, mergedFeaturesData.length - itemsToShow);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(lastPossibleIndex, prevIndex + 1));
  };
  
  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, lastPossibleIndex));
  };

  const translateXValue = useMemo(() => {
    const slideWidth = 100 / itemsToShow;
    return currentIndex * slideWidth;
  }, [currentIndex, itemsToShow]);
  
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
            style={{ 
                transform: `translateX(-${translateXValue}%)`,
                '--items-to-show': itemsToShow 
            }}
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