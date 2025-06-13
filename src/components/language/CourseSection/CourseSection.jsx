import React from "react";
import { useTranslation } from "react-i18next";
import FindOutMoreBtn from '../../common/Button/FindOutMoreBtn';
import './CourseSection.css';

function CourseSection({ course, layout = 'image-left' }) {
    const { i18n } = useTranslation();
    const lang = i18n.language;

    const title = course[`title_${lang}`] || course.title_ua;
    const shortDescription = course[`shortDescription_${lang}`] || course.shortDescription_ua;
    const featuresList = (course[`included_${lang}`] || course.included_ua || []).map(item => item.text);

    const sectionClasses = `course-section ${layout === 'image-right' ? 'layout-image-right' : 'layout-image-left'}`;

    return (
        <section className={sectionClasses}>
            <div className="course-image-container">
                <img
                    src={course.coverImage} 
                    alt={title}
                    className="course-image"
                    loading="lazy"
                />
            </div>
            <div className="course-info-container">
                <h2 className="course-title">{title}</h2>
                {shortDescription && <p className="course-description">{shortDescription}</p>}
                {featuresList.length > 0 && (
                    <ul className="course-features">
                        {featuresList.map((feature, index) => (
                            <li key={index}>
                                <span className="feature-bullet">•</span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                )}
                <FindOutMoreBtn courseSlug={course.slug} />
            </div>
        </section>
    );
}

export default CourseSection;