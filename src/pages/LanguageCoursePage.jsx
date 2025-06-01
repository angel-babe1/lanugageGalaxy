import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Проверьте путь
import './LanguageCoursePage.css';

import CourseIntro from "../components/language/CourseIntro/CourseIntro.jsx"; // Проверьте путь
import CourseSection from "../components/language/CourseSection/CourseSection.jsx"; // Проверьте путь
import Loader from "../components/common/Loader/Loader.jsx"; // Проверьте путь

function LanguageCoursePage() {
    const { languageId } = useParams(); // Например, 'en', 'zh'
    const [languageData, setLanguageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLanguageData = async () => {
            setLoading(true);
            setError(null);
            try {
                const docRef = doc(db, "courses", languageId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setLanguageData(docSnap.data());
                } else {
                    setError(`Дані для мови "${languageId}" не знайдено`);
                }
            } catch (err) {
                console.error("Помилка завантаження даних мови:", err);
                setError("Помилка завантаження даних");
            } finally {
                setLoading(false);
            }
        };

        fetchLanguageData();
    }, [languageId]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <main className="language-course-page-main error-page">
                <div className="container">
                    <h1>{error}</h1>
                    <p>На жаль, ми не змогли завантажити інформацію.</p>
                    <Link to="/studying" className="back-link">← Повернутись до вибору мови</Link>
                </div>
            </main>
        );
    }

    if (!languageData) {
        return null; // Или другое сообщение, если данные не загрузились, но нет ошибки
    }

    const { languageName, intro, courses } = languageData;

    console.log("Language Data from Firestore:", languageData);
    console.log("Intro object from languageData:", intro);
    if (intro) {
        console.log("intro.testLink:", intro.testLink);
        console.log("intro.testButtonText:", intro.testButtonText);
    }

    // Преобразуем объект courses в массив, чтобы удобно итерироваться
    // Сортировка необязательна, но может быть полезна, если порядок важен
    // и не гарантируется Firestore (например, по уровню сложности A1->C2)
    const courseList = courses ? Object.values(courses) : [];
    // Можно добавить сортировку, если нужно, например, по названию или специальному полю order

    if (courseList.length > 0 && courseList[0].hasOwnProperty('levelOrder')) {
        courseList.sort((a, b) => (a.levelOrder || 0) - (b.levelOrder || 0));
    }

    return (
        <main className="language-course-page-main">
            <div className="container">
                <Link to="/studying" className="back-link">← Назад до вибору мови</Link>
                {intro && (
                    <CourseIntro
                        languageName={languageName}
                        text={intro.text}
                        image={intro.image}
                        alt={intro.alt}
                        buttonText={intro.testButtonText}
                        testLink={intro.testLink}
                    />
                )}

                {courseList.length > 0 && courseList.map((course, index) => (
                    <React.Fragment key={course.slug || index}>
                        <hr className="section-divider" />
                        <CourseSection
                            course={course} // Передаем весь объект курса
                            languageId={languageId}
                            // Чередуем layout для визуального разнообразия
                            layout={index % 2 === 0 ? 'image-left' : 'image-right'}
                        />
                    </React.Fragment>
                ))}
                {courseList.length === 0 && <p>Для цієї мови ще немає доступних курсів.</p>}
            </div>
        </main>
    );
}

export default LanguageCoursePage;