import React from "react";
import { useTranslation } from "react-i18next";
import languageGalaxyAnimation from '../../../../assets/images/languageGalaxyAnimation.mp4';
import './AboutIntroSection.css';

function AboutIntroSection() {
    const { t } = useTranslation();

    return (
        <section className="about-intro-section">
            <video className="intro-video"
                src={languageGalaxyAnimation}
                autoPlay
                muted
                loop
                playsInline
            >
                {t('aboutPage.intro.videoFallback')}
            </video>
        </section>
    )
}

export default AboutIntroSection;