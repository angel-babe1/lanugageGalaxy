import React from 'react';
import { Link } from 'react-router-dom';
import './BlogCard.css'; 

function BlogCard({ id, slug, title, description, image }) {
    const postUrl = `/blog/${slug || id}`;

    return (
        <Link to={postUrl} className="blog-card-link">
            <div className="blog-card">
                <div className="blog-card-image-placeholder">
                    {image && <img src={image} alt="" className="blog-card-image" />}
                    {!image && <div className="image-fallback"></div>}
                </div>
                <div className="blog-card-content">
                    <h3 className="blog-card-title">{title}</h3>
                    {description && <p className="blog-card-description">{description}</p>}
                </div>
            </div>
        </Link>
    );
}

export default BlogCard;