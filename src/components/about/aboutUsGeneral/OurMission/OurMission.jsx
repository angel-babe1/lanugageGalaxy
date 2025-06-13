import React from "react";
import { useTranslation } from "react-i18next";
import './OurMission.css';

import ourMissionImg from '../../../../assets/images/ourMissionImg.svg';

function OurMission() {
    const { t } = useTranslation();

    return (
        <section className="our-mission-section">
            <div className="container">
                <h2 className="mission-title">{t('aboutPage.mission.title')}</h2>
                <div className="mission-image-wrapper">
                    <img src={ourMissionImg} alt={t('aboutPage.mission.imageAlt')} className="mission-image" />
                </div>
            </div>
        </section>
    )
}

export default OurMission;