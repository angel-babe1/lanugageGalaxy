import React from "react";
import BenefitCard from "../BenefitCard/BenefitCard";
import { benefits, alienImgSrc, ufoImgSrc, logoTextImgSrc } from "../../../../data/studyingBenefitsData";
import './StudyingBenefitsSection.css';

function StudyingBenefitsSection() {

    return (
        <section className="container">
             <h2 className="studying-benefits-title">Навчання з нами</h2>
            <div className="studying-benefits-section">
           
            <div className="benefits-layout-container">
                <img src={alienImgSrc} alt="Alien mascot" className="benefit-background-img benefit-alien-img" />
                <img src={ufoImgSrc} alt="ufo" className="benefit-background-img benefit-ufo-img"/>
                <img src={logoTextImgSrc} alt="logo text" className="benefit-background-img benefit-logo-text-img"/>

                {benefits.map((benefit, index) => (
                    <div key={benefit.id} className={`benefit-card-wrapper benefit-card-${index + 1}`}>
                        <BenefitCard
                            title={benefit.title}
                            description={benefit.description}
                        />
                    </div>
                ))}
            </div>
            </div>
            
        </section>
    )
}

export default StudyingBenefitsSection;