import React from "react";
import { useTranslation } from "react-i18next";
import './Pagination.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
    const { t } = useTranslation();
    if (totalPages <= 1) {
        return null;
    }

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handlePrevClick = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <nav className="pagination-container" aria-label="Page navigation">
            <button
                className="pagination-button prev-next"
                onClick={handlePrevClick}
                disabled={currentPage === 1}
                aria-disabled={currentPage === 1}
            >
                {t('blogPage.pagination.prev')}
            </button>

            <div className="page-numbers">
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        className={`pagination-button page-number ${currentPage === number ? 'active' : ''}`}
                        onClick={() => onPageChange(number)}
                        aria-current={currentPage === number ? 'page' : undefined}
                        aria-label={`Go to page ${number}`}
                    >
                        {number}
                    </button>
                ))}
            </div>

            <button
                className="pagination-button prev-next"
                onClick={handleNextClick}
                disabled={currentPage === totalPages}
                aria-disabled={currentPage === totalPages}
            >
                 {t('blogPage.pagination.next')}
            </button>
        </nav>
    )
}

export default Pagination;