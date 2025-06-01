import React from "react";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import LanguageCardsSection from "../components/language/LanguageCardsSection/LanguageCardsSection";
import './Studying.css';
import StudyingIntroSection from "../components/studying/StudyingIntroSection";


function StudyingPage() {
   
    return (
        <>
            <main className="container studying-page-main">
                <StudyingIntroSection />
                <h2>Виберіть мову</h2>
                <div className="language-selector">
                    <LanguageCardsSection />
                </div>
            </main>
        </>
    )
}

export default StudyingPage;