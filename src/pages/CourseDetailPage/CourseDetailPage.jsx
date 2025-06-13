import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../content/CartContext';

import Loader from '../../components/common/Loader/Loader';
import CourseDetailHeader from '../../components/courseDetail/CourseDetailHeader/CourseDetailHeader';
import CourseAboutSection from '../../components/courseDetail/CourseAboutSection/CourseAboutSection';
import CourseDetailProgram from '../../components/courseDetail/CourseDetailProgram/CourseDetailProgram';
import CourseDetailGoals from '../../components/courseDetail/CourseDetailGoals/CourseDetailGoals';
import PlatformIcon from '../../components/courseDetail/PlatformIcon/PlatformIcon';
import CourseReviewsSection from '../../components/courseDetail/CourseReviewsSection/CourseReviewsSection';

import { reviewImages } from '../../data/courseReviews';
import zoomIcon from '../../assets/images/platforms/Zoom.svg';
import classroomIcon from '../../assets/images/platforms/Classroom.svg';
import telegramIcon from '../../assets/images/platforms/Telegram.svg';
import miroIcon from '../../assets/images/platforms/Miro.svg';

import './CourseDetailPage.css';

function CourseDetailPage() {
  const { courseSlug } = useParams();
  const { i18n, t } = useTranslation();
  const { addItemToCart } = useCart();
  
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lang = i18n.language;

  const platforms = [
    { name: 'Zoom', iconSrc: zoomIcon },
    { name: 'Classroom', iconSrc: classroomIcon },
    { name: 'Telegram', iconSrc: telegramIcon },
    { name: 'Miro', iconSrc: miroIcon }
  ];

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!courseSlug) throw new Error("Course Slug відсутній в URL.");
        
        const docRef = doc(db, 'courses_final', courseSlug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCourseData({ ...docSnap.data(), id: docSnap.id });
        } else {
          setError(t('courseDetailsPage.courseNotFound'));
        }
      } catch (err) {
        console.error("Помилка при завантаженні деталей курсу:", err);
        setError(err.message || "Не вдалося завантажити дані курсу.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseSlug, t]);

  const displayData = useMemo(() => {
    if (!courseData) return null;

    return {
      slug: courseData.id,
      title: courseData[`title_${lang}`] || courseData.title_ua,
      shortDescription: courseData[`shortDescription_${lang}`] || courseData.shortDescription_ua,
      fullDescription: courseData[`fullDescription_${lang}`] || courseData.fullDescription_ua,
      duration: courseData[`duration_${lang}`] || courseData.duration_ua,
      goals: courseData[`goals_${lang}`] || courseData.goals_ua || [],
      includedItems: courseData[`included_${lang}`] || courseData.included_ua || [],
      program: courseData[`courseProgram_${lang}`] || courseData.courseProgram_ua || [],
      price: courseData.price,
      coverImage: courseData.coverImage
    };
  }, [courseData, lang]);

  const handlePurchase = () => {
    if (displayData && courseData) {
      const productToAdd = { 
        slug: displayData.slug,
        title: displayData.title,
        price: displayData.price,
        coverImage: displayData.coverImage,
        language: courseData.language,
        shortDescription: displayData.shortDescription,
      };
      addItemToCart(productToAdd);
      alert(`${displayData.title} ${t('courseDetailsPage.addedToCart')}`);
    }
  };

  if (loading) return <Loader />;
  if (error) return (
    <main className="course-detail-page-main error-page">
      <div className="container">
        <h1>{error}</h1>
        <Link to="/studying" className="back-link">{t('courseDetailsPage.backToCourses')}</Link>
      </div>
    </main>
  );

  if (!displayData) return (
    <main className="course-detail-page-main error-page">
      <div className="container">
        <h1>{t('courseDetailsPage.courseNotFound')}</h1>
        <Link to="/studying" className="back-link">{t('courseDetailsPage.backToCourses')}</Link>
      </div>
    </main>
  );

  return (
    <main className="course-detail-page-main">
      <div className="container">
        <Link to="/studying" className="back-link">{t('courseDetailsPage.backToCourses')}</Link>

        <CourseDetailHeader
          title={displayData.title}
          coverImage={displayData.coverImage}
          shortDescription={displayData.shortDescription}
          price={displayData.price}
          onPurchase={handlePurchase}
        />

        <div className="course-detail-content-wrapper">
          <div className="course-detail-main-content">
            <CourseAboutSection
              fullDescription={displayData.fullDescription}
              duration={displayData.duration}
              includedItems={displayData.includedItems}
            />
            {displayData.program.length > 0 && (
              <CourseDetailProgram program={displayData.program} />
            )}
            {displayData.goals.length > 0 && (
              <CourseDetailGoals goals={displayData.goals} />
            )}
          </div>

          <aside className="course-detail-sidebar">
            <hr className="section-divider-top" />
            <section className="course-detail-section course-detail-sidebar-section">
              <h2>{t('courseDetailsPage.platformsTitle')}</h2>
              <div className="platforms-container">
                {platforms.map((platform) => (
                  <PlatformIcon
                    key={platform.name}
                    iconSrc={platform.iconSrc}
                    name={platform.name}
                  />
                ))}
              </div>
            </section>
          </aside>
        </div>
        <CourseReviewsSection reviews={reviewImages} />
      </div>
    </main>
  );
}

export default CourseDetailPage;