import React from "react";
import { Link } from "react-router-dom";
import './CallToActionBlock.css';
import Button from '../Button/FindOutMoreBtn';

function CallToActionBlock() {
    return (
        <div className="cta-block">
            <p>Хочете не просто вивчати мову, а й розуміти її справжню культуру?</p>
            <p>Приєднуйтесь до наших курсів англійської, китайської, японської та корейської мов!</p>
            <p>На нашому сайті ви знайдете опис програм, розклад та можете записатися вже сьогодні.</p>
            <Button to="/studying"/>
        </div>
    )
}

export default CallToActionBlock;