import React from "react";
import { useTranslation } from "react-i18next";
import './AboutSchool.css';

import aboutPic1 from '../../../../assets/images/about-pic1.png';
import aboutPic2 from '../../../../assets/images/about-pic2.jpg';

function AboutSchool() {
    const { t } = useTranslation();

    const paragraphs = t('aboutPage.schoolInfo.paragraphs', { returnObjects: true });
    const listItems = t('aboutPage.schoolInfo.howWeTeachList', { returnObjects: true });

    return (
        <section className="container about-school-container">
            <h2 className="about-school-title">{t('aboutPage.schoolInfo.title')}</h2>
            <div className="about-intro-content">
                <div className="about-intro-pictures">
                    <img src={aboutPic1} alt={t('aboutPage.schoolInfo.image1Alt')} className="about-intro-image about-intro-image-top" />
                    <img src={aboutPic2} alt={t('aboutPage.schoolInfo.image2Alt')} className="about-intro-image about-intro-bottom" />
                </div>
                <div className="about-intro-text">
                    {Array.isArray(paragraphs) && paragraphs.map((text, index) => (
                        <p key={index}>{text}</p>
                    ))}

                    <h4>{t('aboutPage.schoolInfo.howWeTeachTitle')}</h4>

                    <ul>
                        {Array.isArray(listItems) && listItems.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default AboutSchool;