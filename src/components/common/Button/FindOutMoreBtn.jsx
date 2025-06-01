import React from "react";
import { Link } from "react-router-dom";
import './FindOutMoreBtn.css';

function FindOutMoreBtn({ languageId, courseSlug, children }) {
    if (!languageId || !courseSlug) {
        return <button className="find-more-btn" disabled>{children || "Дізнатись більше"}</button>;
    }

    return (
        <Link to={`/courses/${languageId}/${courseSlug}`} className="find-more-btn">
            {children || "Дізнатись більше"}
        </Link>
    );
}

export default FindOutMoreBtn;