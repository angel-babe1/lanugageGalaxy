import React, { useEffect, useState } from "react";
import TeacherCard from "../TeacherCard/TeacherCard";
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../../../firebase';
import { useTranslation } from 'react-i18next'; 

function TeachersList() {
  const { i18n } = useTranslation(); 
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "teachers"));
        const teachersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTeachers(teachersData);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) return <div>Loading teachers...</div>;

  const lang = i18n.language;

  return (
    <div>
      {teachers.map((teacher) => {
        const name = teacher[`name_${lang}`] || teacher.name_ua;
        const description = teacher[`description_${lang}`] || teacher.description_ua;
        const skills = teacher[`skills_${lang}`] || teacher.skills_ua || []; 

        return (
          <TeacherCard
            key={teacher.id}
            name={name}
            photo={teacher.photo} 
            description={description}
            skills={skills}
          />
        );
      })}
    </div>
  );
}

export default TeachersList;