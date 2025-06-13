import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import koreanMemoryData from '../../../data/games/koreanMemoryData';
import './KoreanMemoryGame.css';

const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

function KoreanMemoryGame() {
    const [deck, setDeck] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [isChecking, setIsChecking] = useState(false);
    const [isGameFinished, setIsGameFinished] = useState(false);
    
    const [attempts, setAttempts] = useState(0);
    const [time, setTime] = useState(0);
    const timerRef = useRef(null);

    const resetGame = () => {
        const gameCards = koreanMemoryData.flatMap(pair => [
            { matchId: pair.id, content: pair.korean, cardId: `${pair.id}-korean` },
            { matchId: pair.id, content: pair.ukrainian, cardId: `${pair.id}-ukrainian` }
        ]);
        setDeck(shuffleArray(gameCards));
        
        setFlippedCards([]);
        setMatchedPairs([]);
        setIsChecking(false);
        setIsGameFinished(false);
        setAttempts(0);
        setTime(0);

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    };

    useEffect(() => {
        resetGame();
        return () => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if (flippedCards.length === 2) {
            setIsChecking(true);
            const [firstCard, secondCard] = flippedCards;
            if (deck[firstCard].matchId === deck[secondCard].matchId) {
                setMatchedPairs(prev => [...prev, deck[firstCard].matchId]);
                setFlippedCards([]);
                setIsChecking(false);
            } else {
                setAttempts(prev => prev + 1);
                setTimeout(() => {
                    setFlippedCards([]);
                    setIsChecking(false);
                }, 1000);
            }
        }
    }, [flippedCards, deck]);

    useEffect(() => {
        if (koreanMemoryData.length > 0 && matchedPairs.length === koreanMemoryData.length) {
            setIsGameFinished(true);
            clearInterval(timerRef.current);
        }
    }, [matchedPairs]);

    const handleCardClick = (index) => {
        if (isChecking || flippedCards.includes(index) || matchedPairs.includes(deck[index].matchId)) {
            return;
        }
        if (flippedCards.length < 2) {
            setFlippedCards(prev => [...prev, index]);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <main className="game-page-main memory-game-bg">
            <div className="container game-container">
                <Link to="/games" className="back-to-games-link">← Назад до всіх ігор</Link>
                <h1 className="game-title">Знайди пару: Корейські слова</h1>

                <div className="game-stats">
                    <div className="stat-item">Час: <span className="stat-value">{formatTime(time)}</span></div>
                    <div className="stat-item">Спроби: <span className="stat-value">{attempts}</span></div>
                </div>

                <div className="memory-game-board">
                    {deck.map((card, index) => {
                        const isFlipped = flippedCards.includes(index);
                        const isMatched = matchedPairs.includes(card.matchId);
                        return (
                            <div
                                key={index}
                                className={`memory-card ${isFlipped || isMatched ? 'is-flipped' : ''}`}
                                onClick={() => handleCardClick(index)}
                            >
                                <div className="card-inner">
                                    <div className="card-front"></div>
                                    <div className={`card-back ${isMatched ? 'matched' : ''}`}>
                                        {card.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {isGameFinished && (
                    <div className="game-finished-overlay">
                        <div className="game-finished-modal">
                            <h2>Перемога!</h2>
                            <p>Ви знайшли всі пари слів.</p>
                            <div className="final-stats">
                                <span>Час: {formatTime(time)}</span>
                                <span>Помилок: {attempts}</span>
                            </div>
                            <button onClick={resetGame} className="play-again-button">Зіграти ще раз</button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default KoreanMemoryGame;