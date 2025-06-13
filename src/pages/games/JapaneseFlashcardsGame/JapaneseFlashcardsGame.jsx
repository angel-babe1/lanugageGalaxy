import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import japaneseFlashcardsData from '../../../data/games/japaneseFlashcardsData';
import './JapaneseFlashcardsGame.css';

const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

function JapaneseFlashcardsGame() {
    const [emojiCards, setEmojiCards] = useState([]);
    const [wordCards, setWordCards] = useState([]);

    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [selectedWord, setSelectedWord] = useState(null);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [isWrong, setIsWrong] = useState(false);
    const [isGameFinished, setIsGameFinished] = useState(false);

    const [attempts, setAttempts] = useState(0);
    const [time, setTime] = useState(0);
    const timerRef = useRef(null); 

    const resetGame = () => {
        setEmojiCards(shuffleArray(japaneseFlashcardsData));
        setWordCards(shuffleArray(japaneseFlashcardsData));

        setSelectedEmoji(null);
        setSelectedWord(null);
        setMatchedPairs([]);
        setIsWrong(false);
        setIsGameFinished(false);

        setAttempts(0);
        setTime(0);

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);
    };

    useEffect(() => {
        resetGame();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    useEffect(() => {
        if (selectedEmoji && selectedWord) {
            if (selectedEmoji.id === selectedWord.id) {
                setMatchedPairs(prev => [...prev, selectedEmoji.id]);
                setSelectedEmoji(null);
                setSelectedWord(null);
            } else {
                setAttempts(prev => prev + 1);
                setIsWrong(true);
                setTimeout(() => {
                    setSelectedEmoji(null);
                    setSelectedWord(null);
                    setIsWrong(false);
                }, 800);
            }
        }
    }, [selectedEmoji, selectedWord]);

    useEffect(() => {
        if (japaneseFlashcardsData.length > 0 && matchedPairs.length === japaneseFlashcardsData.length) {
            setIsGameFinished(true);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    }, [matchedPairs]);


    const handleEmojiClick = (card) => {
        if (!selectedEmoji && !matchedPairs.includes(card.id)) {
            setSelectedEmoji(card);
        }
    };

    const handleWordClick = (card) => {
        if (!selectedWord && !matchedPairs.includes(card.id)) {
            setSelectedWord(card);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <main className="game-page-main">
            <div className="container game-container">
                <Link to="/games" className="back-to-games-link">← Назад до всіх ігор</Link>
                <h1 className="game-title">Японські картки: З'єднай пару</h1>
                
                <div className="game-stats">
                    <div className="stat-item">
                        <span className="stat-label">Час:</span>
                        <span className="stat-value">{formatTime(time)}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Спроби:</span>
                        <span className="stat-value">{attempts}</span>
                    </div>
                </div>

                <p className="game-instructions">
                    Клікни на емодзі, а потім на відповідне слово японською.
                </p>

                <div className="flashcard-game-board">
                    <div className="flashcard-column">
                        {emojiCards.map(card => (
                            <button
                                key={`emoji-${card.id}`}
                                onClick={() => handleEmojiClick(card)}
                                className={`
                                    flashcard emoji-card
                                    ${selectedEmoji?.id === card.id ? 'selected' : ''}
                                    ${matchedPairs.includes(card.id) ? 'matched' : ''}
                                    ${isWrong && selectedEmoji?.id === card.id ? 'wrong' : ''}
                                `}
                                disabled={matchedPairs.includes(card.id) || selectedEmoji}
                            >
                                {card.emoji}
                            </button>
                        ))}
                    </div>

                    <div className="flashcard-column">
                        {wordCards.map(card => (
                            <button
                                key={`word-${card.id}`}
                                onClick={() => handleWordClick(card)}
                                className={`
                                    flashcard word-card
                                    ${selectedWord?.id === card.id ? 'selected' : ''}
                                    ${matchedPairs.includes(card.id) ? 'matched' : ''}
                                    ${isWrong && selectedWord?.id === card.id ? 'wrong' : ''}
                                `}
                                disabled={matchedPairs.includes(card.id) || selectedWord}
                            >
                                {card.word}
                            </button>
                        ))}
                    </div>
                </div>

                {isGameFinished && (
                    <div className="game-finished-overlay">
                        <div className="game-finished-modal">
                            <h2>Чудово!</h2>
                            <p>Ви успішно з'єднали всі пари.</p>
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

export default JapaneseFlashcardsGame;