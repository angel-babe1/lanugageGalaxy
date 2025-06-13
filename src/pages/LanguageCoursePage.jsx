// src/pages/LanguageCoursePage.jsx (фінальна версія)
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase"; 
import { useTranslation } from "react-i18next";

import CourseIntro from "../components/language/CourseIntro/CourseIntro.jsx"; 
import CourseSection from "../components/language/CourseSection/CourseSection.jsx"; 
import Loader from "../components/common/Loader/Loader.jsx"; 

import './LanguageCoursePage.css';

const introStaticData = {
    en: { image: '/images/courses/englishIntroImg.png', testLink: 'https://forms.gle/xjd3Xr6TWKhXctjH6' },
    ja: { image: '/images/courses/japaneseIntroImg.jpg', testLink: 'https://forms.gle/xjd3Xr6TWKhXctjH6' },
    ko: { image: '/images/courses/koreanIntroImg.jfif', testLink: 'https://forms.gle/xjd3Xr6TWKhXctjH6' },
    zh: { image: '/images/courses/chineseIntroImg.jpg', testLink: 'https://forms.gle/xjd3Xr6TWKhXctjH6' },
};

function LanguageCoursePage() {
    const { languageId } = useParams(); 
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!introStaticData[languageId]) {
            navigate('/studying');
        }
    }, [languageId, navigate]);
    
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const coursesRef = collection(db, "courses_final");
                const q = query(coursesRef, where("language", "==", languageId));
                const querySnapshot = await getDocs(q);
                
                const courseList = querySnapshot.docs.map(doc => ({...doc.data(), slug: doc.id}));
                courseList.sort((a, b) => (a.levelOrder || 0) - (b.levelOrder || 0));
                setCourses(courseList);
            } catch (err) {
                console.error("Помилка завантаження курсів:", err);
                setError("Помилка завантаження даних");
            } finally {
                setLoading(false);
            }
        };
        if (introStaticData[languageId]) {
            fetchCourses();
        }
    }, [languageId]);

    const introDisplay = t(`studyingPage.languageIntro.${languageId}`, { returnObjects: true });
    const staticData = introStaticData[languageId] || {};

    if (loading) return <Loader />;
    if (error) return <div>{error}</div>;

    return (
        <main className="language-course-page-main">
            <div className="container">
                <Link to="/studying" className="back-link">{t('studyingPage.backToChoice')}</Link>
                
                <CourseIntro
                    languageName={introDisplay.languageName}
                    text={introDisplay.text}
                    image={staticData.image}
                    alt={introDisplay.alt}
                    buttonText={introDisplay.buttonText}
                    testLink={staticData.testLink}
                />

                {courses.length > 0 ? courses.map((course, index) => (
                    <React.Fragment key={course.slug || index}>
                        <hr className="section-divider" />
                        <CourseSection
                            course={course}
                            layout={index % 2 === 0 ? 'image-left' : 'image-right'}
                        />
                    </React.Fragment>
                )) : (
                    <p>{t('studyingPage.noCourses')}</p>
                )}
            </div>
        </main>
    );
}

export default LanguageCoursePage;