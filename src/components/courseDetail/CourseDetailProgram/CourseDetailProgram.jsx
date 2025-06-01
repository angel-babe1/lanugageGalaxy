import React from 'react';
import AccordionItem from '../AccordionItem/AccordionItem';
import './CourseDetailProgram.css'; // Создайте этот CSS

const CourseDetailProgram = ({ program }) => {
  if (!program || program.length === 0) {
    return null;
  }

  return (
    <section className="course-detail-section course-program-section">
      <hr className="section-divider-top" />
      <h2>Програма курсу</h2>
      <div className="accordion-container">
        {program.map((module, index) => (
          <AccordionItem
            key={module.moduleTitle + index} // Убедитесь, что ключ уникален
            moduleTitle={module.moduleTitle}
            lessons={module.lessons}
            initiallyOpen={index === 0} // Например, открывать первый модуль по умолчанию
          />
        ))}
      </div>
    </section>
  );
};

export default CourseDetailProgram;