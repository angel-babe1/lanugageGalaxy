import React from 'react';
import { Link } from 'react-router-dom';
import './GameCard.css';


function GameCard({ slug, language, title, description, image }) {
    const gameUrl = `/games/${slug}`; 

    return (
        <Link to={gameUrl} className="game-card-link">
            <div className="game-card">
                <div className="game-card-image-placeholder">
                    {image && <img src={image} alt="" className="game-card-image" />}
                    {!image && <div className="image-fallback-text">Зображення гри</div>}
                    <span className="game-card-language-tag">{language}</span>
                </div>
                <div className="game-card-content">
                    <h3 className="game-card-title">{title}</h3>
                    <p className="game-card-description">{description}</p>
                </div>
            </div>
        </Link>
    );
}

export default GameCard;