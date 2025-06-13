import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import BenefitCard from "../BenefitCard/BenefitCard";
import { benefits, alienImgSrc, ufoImgSrc, logoTextImgSrc } from "../../../../data/studyingBenefitsData";
import './StudyingBenefitsSection.css';

function StudyingBenefitsSection() {
    const { t, i18n } = useTranslation();

    const translatedBenefits = t('aboutPage.benefits.cards', { returnObjects: true });

    const mergedBenefits = useMemo(() => {
        if (!Array.isArray(translatedBenefits)) return [];
        return benefits.map(benefit => {
            const translated = translatedBenefits.find(tBenefit => tBenefit.id === benefit.id) || {};
            return {
                ...benefit,
                ...translated
            };
        });
    }, [i18n.language, translatedBenefits]);

    return (
        <section className="container">
            <h2 className="studying-benefits-title">{t('aboutPage.benefits.title')}</h2>
            <div className="studying-benefits-section">

                <div className="benefits-layout-container">
                    <img src={alienImgSrc} alt={t('aboutPage.benefits.alienAlt')} className="benefit-background-img benefit-alien-img" />
                    <img src={ufoImgSrc} alt={t('aboutPage.benefits.ufoAlt')} className="benefit-background-img benefit-ufo-img" />
                    <img src={logoTextImgSrc} alt={t('aboutPage.benefits.logoTextAlt')} className="benefit-background-img benefit-logo-text-img" />

                    {mergedBenefits.map((benefit, index) => (
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