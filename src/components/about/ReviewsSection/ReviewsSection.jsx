import React from "react";
import reviewsData from "../../../data/reviews";
import './ReviewsSection.css';

const reviewImageModules = import.meta.glob('../../../assets/images/reviews/*.{png,jpg,jpeg,webp,svg}', { eager: true });

function getReviewImageUrl(filename) {
    const path = `../../../assets/images/reviews/${filename}`;
    if (reviewImageModules[path]) {
        return reviewImageModules[path].default;
    }
    else {
        console.warn(`Review image module not found for filename: ${filename} using path key: ${path}. Available keys:`, Object.keys(reviewImageModules));
        return '';
    }
}

function ReviewsSection() {
    return (
        <section className="reviews-section">
            <h2 className="reviews-title">Reviews</h2>
            <div className="reviews-container">
                {reviewsData.map((review, index) => (
                    <img 
                    key={review.id}
                    src={getReviewImageUrl(review.src)}
                    alt={review.alt}
                    className={`review-image review${index + 1}`}
                    />
                ))}
            </div>
        </section>
    )
}

export default ReviewsSection;