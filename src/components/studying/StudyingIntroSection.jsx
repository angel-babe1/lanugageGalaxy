import React from "react";
import studyingImg from '../../assets/images/studyingImg.png';
import './StudyingIntroSection.css';

function StudyingIntroSection() {
    return (
        <section className="container">
            <div className="studying-intro-section">
                <div className="studying-intro-text">
                    <h2 className="studying-intro-title">Вчись з Language Galaxy</h2>
                    <p>Language galaxy can offer you different languages and programs. So just choose the language you want to try and if you want to check your language skills, you can always take a test. And if you’re interested in finding out some useful information or phrases, you can check our blog articles.</p>
                    <p>Let’s take a test and find the program for you</p>
                </div>
                <div className="studying-intro-image">
                    <img src={studyingImg} alt="" />
                </div>
            </div>

            <hr className="studying-intro-divider" />
        </section>
    )
}

export default StudyingIntroSection;