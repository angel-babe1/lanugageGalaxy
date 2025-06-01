import React from 'react';
import './TeacherCard.css';

function TeacherCard({name, photo, description, skills}) {
    return (
        <div className="teacher-card">
            <div className="teacher-image-container">
                <img src={photo} alt={name} />
                <h3>{name}</h3>
            </div>
            <div className="teacher-info">
                <p className='teacher-description'>{description}</p>
                <ul className='teacher-skills'>
                    {skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default TeacherCard;