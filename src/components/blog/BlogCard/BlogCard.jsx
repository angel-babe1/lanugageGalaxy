import React from 'react';
import { Link } from 'react-router-dom';
import './BlogCard.css';

function BlogCard({ id, slug, title, description, image }) {
    return (
        <Link to={`/blog/${slug}`} className="blog-card-link">
            <div className="blog-card">
                <div className="blog-card-image-container">
                    <img src={image} alt={title} className="blog-card-image" />
                </div>
                <div className="blog-card-content">
                    <h3 className="blog-card-title">{title}</h3>
                    <p className="blog-card-description">{description}</p>
                </div>
            </div>
        </Link>
    );
}

export default BlogCard;