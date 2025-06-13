import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import chineseSentenceData from '../../../data/games/chineseSentenceData';
import './ChineseSentenceGame.css';

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

function WordTile({ id, content }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="word-tile">
            {content}
        </div>
    );
}

function ChineseSentenceGame() {
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [wordTiles, setWordTiles] = useState([]); 
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const loadSentence = (index) => {
        const sentenceData = chineseSentenceData[index];
        setWordTiles(shuffleArray(sentenceData.chinese.map((word, i) => ({ id: `tile-${i}`, content: word }))));
        setFeedback({ type: '', message: '' });
    };

    useEffect(() => {
        loadSentence(currentSentenceIndex);
    }, [currentSentenceIndex]);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setWordTiles((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const checkAnswer = () => {
        const correctSentence = chineseSentenceData[currentSentenceIndex].chinese.join('');
        const userAnswer = wordTiles.map(word => word.content).join('');

        if (userAnswer === correctSentence) {
            setFeedback({ type: 'success', message: 'Правильно!' });
            setTimeout(() => {
                if (currentSentenceIndex < chineseSentenceData.length - 1) {
                    setCurrentSentenceIndex(prev => prev + 1);
                } else {
                    setFeedback({ type: 'finished', message: 'Вітаємо! Ви пройшли всі речення.' });
                }
            }, 1500);
        } else {
            setFeedback({ type: 'error', message: 'Спробуйте ще раз.' });
        }
    };
    
    const resetGame = () => {
        setCurrentSentenceIndex(0);
    };

    return (
        <main className="game-page-main sentence-game-bg">
            <div className="container game-container">
                <Link to="/games" className="back-to-games-link">← Назад до всіх ігор</Link>
                <h1 className="game-title">Склади речення: Китайська мова</h1>
                
                <div className="sentence-task-card">
                    <p className="task-label">Постав слова в правильному порядку:</p>
                    <p className="ukrainian-sentence">"{chineseSentenceData[currentSentenceIndex].ukrainian}"</p>
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={wordTiles}>
                        <div className="sentence-box tiles-box">
                            {wordTiles.map(word => (
                                <WordTile key={word.id} id={word.id} content={word.content} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <div className="game-controls">
                    {feedback.message && (
                        <div className={`feedback-message ${feedback.type}`}>{feedback.message}</div>
                    )}
                    {feedback.type !== 'finished' ? (
                        <button onClick={checkAnswer} className="check-button">Перевірити</button>
                    ) : (
                         <button onClick={resetGame} className="play-again-button">Зіграти ще раз</button>
                    )}
                </div>
            </div>
        </main>
    );
}

export default ChineseSentenceGame;