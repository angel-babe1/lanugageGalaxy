import React from "react";
import Slider from "react-slick";
import './CourseReviewsSection.css';

const CourseReviewsSection = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return null;
    }

    const settings = {
        dots: false,
        infinite: reviews.length > 3,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    infinite: reviews.length > 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    infinite: reviews.length > 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    dots: true,
                    arrows: false,
                }
            }
        ]
    };

    return (
        <section className="course-reviews-section">
            <hr className="section-divider-top" />
            <h2>Reviews</h2>
            <div className="course-reviews-slider-container">
                <Slider {...settings}>
                    {reviews.map((review) => (
                        <div key={review.id} className="course-review-slide">
                            <img src={review.src} alt={review.alt} />
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default CourseReviewsSection;