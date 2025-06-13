// migrateToFinal.cjs
const admin = require('firebase-admin');
const serviceAccount = require('../../firebase-scripts/languagegalaxy-f2369-firebase-adminsdk-fbsvc-d2757775b6.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Налаштування
const OLD_COLLECTION = 'courses';
const NEW_COLLECTION = 'courses_final'; // Нова, правильна назва колекції

function transformCourseData(course) {
  const newCourseData = {};

  const nonTranslatableFields = ['photo', 'price', 'levelOrder', 'teacherIds', 'slug', 'coverImage', 'createdAt'];
  nonTranslatableFields.forEach(field => {
    if (course[field] !== undefined) {
      newCourseData[field] = course[field];
    }
  });

  const translatableFields = ['title', 'duration', 'fullDescription', 'shortDescription'];
  translatableFields.forEach(field => {
    if (course[field]) {
      newCourseData[`${field}_ua`] = course[field];
      newCourseData[`${field}_en`] = ''; // Порожнє поле для англійського перекладу
    }
  });

  const translatableArrays = {
    goals: 'title',
    included: 'text'
  };
  for (const arrayName in translatableArrays) {
    const fieldToTranslate = translatableArrays[arrayName];
    if (course[arrayName] && Array.isArray(course[arrayName])) {
      newCourseData[`${arrayName}_ua`] = course[arrayName];
      newCourseData[`${arrayName}_en`] = course[arrayName].map(item => ({
        ...item,
        [fieldToTranslate]: ''
      }));
    }
  }

  if (course.courseProgram && Array.isArray(course.courseProgram)) {
    newCourseData.courseProgram_ua = course.courseProgram;
    newCourseData.courseProgram_en = course.courseProgram.map(module => ({
      ...module,
      moduleTitle: '',
      lessons: module.lessons ? module.lessons.map(lesson => ({
        ...lesson,
        title: ''
      })) : []
    }));
  }
  
  if (course.intro) {
      newCourseData.intro_ua = course.intro;
      newCourseData.intro_en = {
          ...course.intro,
          alt: '',
          testButtonText: '',
          text: '',
          languageName: ''
      };
  }
  return newCourseData;
}

async function runMigration() {
  console.log(`🚀 Початок міграції з "${OLD_COLLECTION}" у нову, просту структуру "${NEW_COLLECTION}"...`);

  try {
    const oldLangDocsSnapshot = await db.collection(OLD_COLLECTION).get();
    let totalCoursesMigrated = 0;

    for (const oldLangDoc of oldLangDocsSnapshot.docs) {
      const langId = oldLangDoc.id;
      const oldData = oldLangDoc.data();
      const coursesMap = oldData.courses;
      
      console.log(`\n- Читання даних з документа [${langId.toUpperCase()}]`);

      if (!coursesMap) {
        console.log(`  🤷‍♂️ Поле "courses" не знайдено. Пропускаємо.`);
        continue;
      }
      
      for (const courseSlug in coursesMap) {
        const courseData = coursesMap[courseSlug];
        
        if (!courseData.slug) {
            console.warn(`  ⚠️ У курсі з ключем "${courseSlug}" відсутнє поле "slug". Це критично! Пропускаємо його.`);
            continue;
        }

        console.log(`  - Трансформація курсу: ${courseData.title}`);

        const transformedData = transformCourseData(courseData);

        // Створюємо новий документ на верхньому рівні, використовуючи slug як ID
        const newDocRef = db.collection(NEW_COLLECTION).doc(courseData.slug);
        await newDocRef.set(transformedData);
        
        totalCoursesMigrated++;
      }
    }

    console.log(`\n\n🎉 Міграцію успішно завершено!`);
    console.log(`✅ Всього оброблено і створено курсів: ${totalCoursesMigrated}.`);
    console.log(`Перевірте нову колекцію "${NEW_COLLECTION}" у консолі Firebase.`);

  } catch (error) {
    console.error('🔥 Сталася критична помилка під час міграції:', error);
  }
}

runMigration();