import React from "react";
import { useTranslation } from "react-i18next";
import './CategoryFilter.css';

function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
    const { t } = useTranslation();

    return (
        <div className="category-filter">
            {categories.map((categoryKey) => (
                <button
                    key={categoryKey}
                    className={`category-button ${selectedCategory === categoryKey ? 'active' : ''}`}
                    onClick={() => onSelectCategory(categoryKey)}
                >
                    {t(`blogPage.categories.${categoryKey}`)}
                </button>
            ))}
        </div>
    );
}

export default CategoryFilter;