import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import englishQuizData from '../../../data/games/englishQuizData';
import './EnglishQuizGame.css';

function EnglishQuizGame() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [score, setScore] = useState(0);
    const [isGameFinished, setIsGameFinished] = useState(false);

    const startGame = () => {
        const shuffledQuestions = [...englishQuizData].sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswerChecked(false);
        setScore(0);
        setIsGameFinished(false);
    };

    useEffect(() => {
        startGame();
    }, []);

    const handleAnswerSelect = (option) => {
        if (!isAnswerChecked) {
            setSelectedAnswer(option);
        }
    };

    const checkAnswer = () => {
        if (selectedAnswer === null) return;

        setIsAnswerChecked(true);
        if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
            setScore(prevScore => prevScore + 1);
        }
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setSelectedAnswer(null);
            setIsAnswerChecked(false);
        } else {
            setIsGameFinished(true);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    
    if (questions.length === 0) {
        return <div>Завантаження...</div>;
    }

    return (
        <main className="game-page-main quiz-game-bg">
            <div className="container game-container quiz-container">
                <Link to="/games" className="back-to-games-link">← Назад до всіх ігор</Link>
                
                {!isGameFinished ? (
                    <>
                        <div className="quiz-header">
                            <h1 className="game-title quiz-title">Англійський тест</h1>
                            <div className="quiz-progress">
                                Питання {currentQuestionIndex + 1} / {questions.length}
                            </div>
                        </div>

                        <div className="quiz-card">
                            <p className="question-text">{currentQuestion.question}</p>
                            <div className="options-container">
                                {currentQuestion.options.map((option, index) => {
                                    let btnClass = 'option-button';
                                    if (isAnswerChecked) {
                                        if (option === currentQuestion.correctAnswer) {
                                            btnClass += ' correct';
                                        } else if (option === selectedAnswer) {
                                            btnClass += ' incorrect';
                                        }
                                    } else {
                                        if (option === selectedAnswer) {
                                            btnClass += ' selected';
                                        }
                                    }
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerSelect(option)}
                                            className={btnClass}
                                            disabled={isAnswerChecked}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        
                        <div className="quiz-controls">
                            {!isAnswerChecked ? (
                                <button onClick={checkAnswer} disabled={selectedAnswer === null} className="check-button">Перевірити</button>
                            ) : (
                                <button onClick={goToNextQuestion} className="next-button">Далі →</button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="game-finished-modal quiz-results">
                         <h2>Тест завершено!</h2>
                         <p className="final-score">Ваш результат: {score} з {questions.length}</p>
                         <button onClick={startGame} className="play-again-button">Спробувати ще раз</button>
                    </div>
                )}
            </div>
        </main>
    );
}

export default EnglishQuizGame;