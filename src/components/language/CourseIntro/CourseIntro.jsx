import React from "react";
import { Link } from "react-router-dom";
import './CourseIntro.css';

function CourseIntro({ languageName, text, image, alt, buttonText, testLink }) {
    return (
        <section className="course-intro-section">
            <h1 className="intro-language-name">{languageName}</h1>
            <div className="course-intro-container">
                <div className="intro-text-content">
                    <p className="intro-description">{text}</p>
                    {testLink && buttonText && (
                        <Link to={testLink} className="intro-test-link">{buttonText}</Link>
                    )}
                </div>
                <div className="intro-image-content">
                    <img src={image} alt={alt} className="intro-image" />
                </div>
            </div>
        </section>
    )
}

export default CourseIntro;