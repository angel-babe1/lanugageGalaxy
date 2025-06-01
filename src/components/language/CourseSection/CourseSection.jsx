import React from "react";
import FindOutMoreBtn from '../../common/Button/FindOutMoreBtn';
import './CourseSection.css';

function CourseSection({
    course,         
    languageId,     
    layout = 'image-left'
}) {
    const { title, coverImage, alt, shortDescription, included, slug } = course;

    const sectionClasses = `course-section ${layout === 'image-right' ? 'layout-image-right' : 'layout-image-left'}`;

    const featuresList = included?.map(item => item.text) || [];

    return (
        <section className={sectionClasses}>
            <div className="course-image-container">
                <img
                    src={coverImage} 
                    alt={alt || title}
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
                <FindOutMoreBtn languageId={languageId} courseSlug={slug} />
            </div>
        </section>
    );
}

export default CourseSection;