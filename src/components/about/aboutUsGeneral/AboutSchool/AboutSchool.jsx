import React from "react";
import './AboutSchool.css';

import aboutPic1 from '../../../../assets/images/about-pic1.png';
import aboutPic2 from '../../../../assets/images/about-pic2.jpg';

function AboutSchool() {
    return (
        <section className="container about-school-container">
            <h2 className="about-school-title">Про нас</h2>
            <div className="about-intro-content">
                <div className="about-intro-pictures">
                    <img src={aboutPic1} alt="aboutPic1" className="about-intro-image about-intro-image-top"/>
                    <img src={aboutPic2} alt="aboutPic2" className="about-intro-image about-intro-bottom"/>
                </div>
                <div className="about-intro-text">
                    <p>Привіт, ми - Language Galaxy і ми раді вітати тебе на нашій сторінці. Школа була заснована в 2021 році. </p>
                    <p>Наша школа иностранных языков ― это пространство, где язык становится частью жизни, а не просто учебным предметом. Мы объединили методики Кембриджского университета, коммуникативный подход и современные digital‑инструменты, чтобы каждое занятие было динамичным, практичным и увлекательным.</p>
                    <p>Мова — це ключ до нових людей і культур. Тому ми створили теплу спільноту, де можна помилятися, жартувати й радіти першим успіхам. Уже після трьох занять відчуваєте: «Ого, я справді можу говорити!»</p>
                    <h4>Як ми навчаємо?</h4>
                    <ul>
                        <li>Комунікація на першому місці. Говоримо з першого заняття; граматичні правила «підтягуються» органічно.</li>
                        <li>Проєкти замість контрольних. Записуєте подкаст, створюєте тревел‑блог чи готуєте пітч‑дек — усе мовою, яку вивчаєте.</li>
                        <li>Індивідуальна дорожня карта. Щомісяця отримуєте звіт про прогрес і план на наступні 4 тижні.
                        </li>
                        <li>Soft deadlines. Пропустили дедлайн? Система нагадає й допоможе надолужити без стресу.</li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default AboutSchool;