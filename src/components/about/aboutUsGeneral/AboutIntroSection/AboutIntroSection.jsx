import React from "react";
import languageGalaxyAnimation from '../../../../assets/images/languageGalaxyAnimation.mp4';
import './AboutIntroSection.css';

function AboutIntroSection() {
    return (
        <section className="about-intro-section">
            <video className="intro-video"
                src={languageGalaxyAnimation}
                autoPlay
                muted
                loop
                playsInline
            >
                Ваш браузер не поддерживает воспроизведение видео.
            </video>
        </section>

    )
}

export default AboutIntroSection;