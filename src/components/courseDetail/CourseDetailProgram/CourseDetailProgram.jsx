import React from 'react';
import { useTranslation } from 'react-i18next';
import AccordionItem from '../AccordionItem/AccordionItem';
import './CourseDetailProgram.css';

const CourseDetailProgram = ({ program }) => {
  const { t } = useTranslation();

  if (!program || program.length === 0) {
    return null;
  }

  return (
    <section className="course-detail-section course-program-section">
      <hr className="section-divider-top" />
      <h2>{t('courseDetailsPage.programTitle')}</h2>
      <div className="accordion-container">
        {program.map((module, index) => (
          <AccordionItem
            key={module.moduleTitle + index}
            moduleTitle={module.moduleTitle}
            lessons={module.lessons}
            initiallyOpen={index === 0}
          />
        ))}
      </div>
    </section>
  );
};

export default CourseDetailProgram;