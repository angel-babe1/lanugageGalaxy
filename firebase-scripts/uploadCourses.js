import admin from 'firebase-admin';
import { coursesData, languageMeta } from '../src/data/coursesData.js';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Получаем текущую директорию
const __dirname = dirname(fileURLToPath(import.meta.url));

// Загружаем сервисный аккаунт
const serviceAccountPath = join(__dirname, 'languagegalaxy-f2369-firebase-adminsdk-fbsvc-d2757775b6.json');
const serviceAccount = JSON.parse(await readFile(serviceAccountPath));

// Инициализация Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadCourses() {
  try {
    const batch = db.batch(); // Используем batch для массовой записи
    const coursesCollection = db.collection('courses');

    // Удаляем старые данные (опционально)
    const snapshot = await coursesCollection.get();
    const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);

    // Загружаем новые курсы
    for (const [languageCode, coursesArray] of Object.entries(coursesData)) {
      const languageDocRef = coursesCollection.doc(languageCode);
      const meta = languageMeta[languageCode] || {};
      
      const languageData = {
        languageName: meta.languageName || languageCode.toUpperCase(), // Имя языка
        intro: meta.intro || null,
        courses: {},
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      // Добавляем каждый курс
      for (const course of coursesArray) {
        const courseSlug = course.slug;
        languageData.courses[courseSlug] = {
          ...course,
          levelOrder: course.levelOrder || 0,
          language: languageCode,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
      }

      batch.set(languageDocRef, languageData);
      console.log(`✅ Подготовлен курс: ${languageCode}`);
    }

    // Выполняем batch запись
    await batch.commit();
    console.log('🔥 Все курсы успешно загружены в Firestore!');
  } catch (error) {
    console.error('❌ Ошибка при загрузке курсов:', error);
  } finally {
    process.exit(0);
  }
}

// Вспомогательная функция для получения названия языка
function getLanguageName(code) {
  const names = {
    en: 'English',
    uk: 'Ukrainian',
    // добавьте другие языки по необходимости
  };
  return names[code] || code;
}

// Запускаем скрипт
await uploadCourses();