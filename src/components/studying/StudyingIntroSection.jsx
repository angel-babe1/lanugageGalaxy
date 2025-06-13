import React from "react";
import { useTranslation } from "react-i18next";
import studyingImg from '../../assets/images/studyingImg.png';
import './StudyingIntroSection.css';

function StudyingIntroSection() {
    const { t } = useTranslation();

    return (
        <section className="studying-intro-section">
            <div className="studying-intro-text">
                <h2 className="studying-intro-title">{t('studyingPage.mainIntro.title')}</h2>
                <p>{t('studyingPage.mainIntro.p1')}</p>
                <p>{t('studyingPage.mainIntro.p2')}</p>
            </div>
            <div className="studying-intro-image">
                <img src={studyingImg} alt={t('studyingPage.mainIntro.imageAlt')} />
            </div>
        </section>
    );
}

export default StudyingIntroSection;