// migrateCourses.cjs (виправлена версія)

const admin = require('firebase-admin');
const serviceAccount = require('../../firebase-scripts/languagegalaxy-f2369-firebase-adminsdk-fbsvc-d2757775b6.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateCourses() {
  console.log('🚀 Starting course data migration (FIXED VERSION)...');

  const oldCoursesCollectionRef = db.collection('courses');
  const newCoursesCollectionRef = db.collection('courses_v2');
  const languages = ['ua', 'en', 'zh', 'ko', 'ja']; 
  const allCoursesData = {}; 

  try {
    for (const lang of languages) {
      console.log(`\nFetching data for language: [${lang}]`);
      const langDocRef = oldCoursesCollectionRef.doc(lang);
      const langDoc = await langDocRef.get();

      if (!langDoc.exists) {
        console.warn(`- Document for language '${lang}' does not exist. Skipping.`);
        continue;
      }

      const coursesInLang = langDoc.data().courses;
      for (const slug in coursesInLang) {
        const courseData = coursesInLang[slug];
        console.log(`  - Processing course: ${slug} for lang: ${lang}`);
        
        // Створюємо запис, якщо його ще немає
        if (!allCoursesData[slug]) {
          allCoursesData[slug] = {};
        }

        // --- ВИПРАВЛЕННЯ ЛОГІКИ ---
        // 1. Копіюємо неперекладні поля ТІЛЬКИ ОДИН РАЗ (з першої мови, де знайшли)
        if (!allCoursesData[slug].slug) { // Перевіряємо по наявності slug
          console.log(`    - This is the first time seeing ${slug}. Copying non-translatable fields.`);
          allCoursesData[slug].slug = courseData.slug;
          allCoursesData[slug].price = courseData.price;
          allCoursesData[slug].language = courseData.language; // Це поле показує основну мову курсу
          allCoursesData[slug].coverImage = courseData.coverImage;
          allCoursesData[slug].createdAt = courseData.createdAt;
          allCoursesData[slug].levelOrder = courseData.levelOrder;
          allCoursesData[slug].teacherIds = courseData.teacherIds || [];
        }

        // 2. Додаємо перекладні поля ЗАВЖДИ, для кожної мови
        console.log(`    - Adding translations for [${lang}]`);
        allCoursesData[slug][`title_${lang}`] = courseData.title || '';
        allCoursesData[slug][`duration_${lang}`] = courseData.duration || '';
        allCoursesData[slug][`shortDescription_${lang}`] = courseData.shortDescription || '';
        allCoursesData[slug][`fullDescription_${lang}`] = courseData.fullDescription || '';
        
        if (courseData.goals) {
          allCoursesData[slug][`goals_${lang}`] = courseData.goals;
        }
        if (courseData.included) {
          allCoursesData[slug][`included_${lang}`] = courseData.included;
        }
        if (courseData.courseProgram) {
          allCoursesData[slug][`courseProgram_${lang}`] = courseData.courseProgram;
        }
      }
    }
    
    console.log(`\n✅ Aggregation complete. Found ${Object.keys(allCoursesData).length} unique courses.`);
    console.log('\nWriting data to new collection "courses_v2"...');
    
    const batch = db.batch();
    for (const slug in allCoursesData) {
      const newCourseData = allCoursesData[slug];
      const newDocRef = newCoursesCollectionRef.doc(slug);
      batch.set(newDocRef, newCourseData);
      console.log(`  - Staging write for: ${slug}`);
    }

    await batch.commit();

    console.log('\n✅ Migration completed successfully!');
    console.log(`Data has been written to the 'courses_v2' collection.`);

  } catch (error) {
    console.error('❌ An error occurred during migration:', error);
  }
}

migrateCourses();