import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Loader from '../../components/common/Loader/Loader';
import { useCart } from '../../content/CartContext';
import './CourseDetailPage.css';

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

function CourseDetailPage() {
  const { languageId, courseSlug } = useParams();
  const { addItemToCart } = useCart();
  const [course, setCourse] = useState(null);
  const [languageName, setLanguageName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        if (!languageId || !courseSlug) {
          throw new Error("Language ID або Course Slug відсутні в URL.");
        }

        const langDocRef = doc(db, 'courses', languageId);
        const langDocSnap = await getDoc(langDocRef);

        if (langDocSnap.exists()) {
          const langData = langDocSnap.data();
          setLanguageName(langData.languageName || languageId.toUpperCase()); // Устанавливаем имя языка
          const courseDetails = langData.courses?.[courseSlug];

          if (courseDetails) {
            setCourse(courseDetails);
          } else {
            setError(`Курс зі slug "${courseSlug}" не знайдено для мови "${languageId}".`);
          }
        } else {
          setError(`Мову "${languageId}" не знайдено.`);
        }
      } catch (err) {
        console.error("Помилка при завантаженні деталей курсу:", err);
        setError(err.message || "Не вдалося завантажити дані курсу.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [languageId, courseSlug]);

  const handlePurchase = () => {
    if (course) {
      const productToAdd = {
        slug: course.slug,
        title: course.title,
        price: course.price,
        coverImage: course.coverImage,
        language: languageId.toLowerCase(),
        shortDescription: course.shortDescription,
      };
      console.log("Adding to cart:", productToAdd);
      addItemToCart(productToAdd);
      alert(`${course.title} додано до кошика!`);
    }
  };

  if (loading) return <Loader />;
  if (error) return (
    <main className="course-detail-page-main error-page">
      <div className="container">
        <h1>{error}</h1>
        <Link to={`/studying/${languageId}`} className="back-link">← Повернутись до курсів мови</Link>
        <br />
        <Link to="/studying" className="back-link">← Повернутись до вибору мови</Link>
      </div>
    </main>
  );

  if (!course) return (
    <main className="course-detail-page-main error-page">
      <div className="container">
        <h1>Курс не знайдено.</h1>
        <Link to={`/studying/${languageId}`} className="back-link">← Повернутись до курсів мови</Link>
      </div>
    </main>
  );

  return (
    <main className="course-detail-page-main">
      <div className="container">
        <Link to={`/studying/${languageId}`} className="back-link">
          ← Назад до курсів {languageName}
        </Link>

        <CourseDetailHeader
          title={course.title}
          coverImage={course.coverImage}
          shortDescription={course.shortDescription}
          price={course.price}
          onPurchase={handlePurchase}
        />

        <div className="course-detail-content-wrapper">
          <div className="course-detail-main-content">
            <CourseAboutSection
              fullDescription={course.fullDescription}
              duration={course.duration}
              includedItems={course.included}
            />
            {course.courseProgram && course.courseProgram.length > 0 && (
              <CourseDetailProgram program={course.courseProgram} />
            )}
            {course.goals && course.goals.length > 0 && (
              <CourseDetailGoals goals={course.goals} />
            )}
          </div>

          <aside className="course-detail-sidebar">
            <hr className="section-divider-top" />
            <section className="course-detail-section course-detail-sidebar-section">
              <h2>Платформи для навчання</h2>
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
            {/* Можно добавить компонент для отзывов, если они есть в данных курса */}
            {/* <CourseReviews reviews={course.reviews} /> */}
          </aside>
        </div>
        <CourseReviewsSection reviews={reviewImages} />
      </div>
    </main>
  );
}

export default CourseDetailPage;