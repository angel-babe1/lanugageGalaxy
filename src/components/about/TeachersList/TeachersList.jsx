import React, { useEffect, useState } from "react";
import TeacherCard from "../TeacherCard/TeacherCard";
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../../../firebase';

function TeachersList() {
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

  return (
    <div>
      {teachers.map((teacher) => (
        <TeacherCard
          key={teacher.id}
          name={teacher.name}
          photo={teacher.photo} 
          description={teacher.description}
          skills={teacher.skills}
        />
      ))}
    </div>
  );
}

export default TeachersList;