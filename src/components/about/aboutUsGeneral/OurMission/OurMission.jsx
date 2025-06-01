import React from "react";
import './OurMission.css';

import ourMissionImg from '../../../../assets/images/ourMissionImg.svg';

function OurMisison() {
    return (
        <section className="our-mission-section">
            <div className="container">
                <h2 className="mission-title">Наша місія</h2>
                <div className="mission-image-wrapper">
                    <img src={ourMissionImg} alt="Карта місії Language Galaxy" className="mission-image" />
                </div>
            </div>
        </section>
    )
}

export default OurMisison;