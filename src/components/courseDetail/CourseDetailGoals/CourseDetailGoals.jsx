import React from 'react';
import './CourseDetailGoals.css'; 

const CourseDetailGoals = ({ goals }) => {
  if (!goals || goals.length === 0) {
    return null;
  }

  const goal1 = goals[0];
  const goal2 = goals[1];
  const goal3 = goals[2];

  return (
    <section className="course-detail-section course-goals-section">
      <hr className="section-divider-top" /> 
      <h2>Цілі</h2> 
      <div className="goals-visualization-container">
        {goal1 && (
          <div className="goal-block goal-block-1">
            <p>{goal1.title}</p>
          </div>
        )}

        {goal2 && (
          <div className="goal-block goal-block-2">
            <p>{goal2.title}</p>
          </div>
        )}

        {goal3 && (
          <div className="goal-block goal-block-3">
            <p>{goal3.title}</p>
          </div>
        )}
      </div>
    </section>
  );
};


export default CourseDetailGoals;