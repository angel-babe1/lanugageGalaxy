import React from 'react';
import { useTranslation } from 'react-i18next';
import StudyingIntroSection from '../components/studying/StudyingIntroSection';
import LanguageCardsSection from '../components/language/LanguageCardsSection/LanguageCardsSection.jsx';
import './Studying.css';

function StudyingPage() {
    const { t } = useTranslation();

    return (
        <main className="studying-page-main">
            <div className="container">
                <StudyingIntroSection />
                <hr className="studying-intro-divider" />
                <h2 className="choose-language-title">{t('studyingPage.chooseLanguageTitle')}</h2>
                <LanguageCardsSection />
            </div>
        </main>
    );
}

export default StudyingPage;