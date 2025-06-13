import React from 'react';
import GameCard from '../components/games/GameCard/GameCard';
import gamesData from '../data/gamesData';
import './GamesPage.css';

function GamesPage() {
  return (
    <>
      <main className="games-page-main">
        <div className="container">
          <h1 className="games-page-title">Ігри для практики мов</h1>
          <p className="games-page-subtitle">
            Виберіть гру, щоб потренувати свої навички у веселій та інтерактивній формі.
          </p>

          <div className="games-grid">
            {gamesData.map((game) => (
              <GameCard
                key={game.id}
                slug={game.slug}
                language={game.language}
                title={game.title}
                description={game.description}
                image={game.image}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default GamesPage;