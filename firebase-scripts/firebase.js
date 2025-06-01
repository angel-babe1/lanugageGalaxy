import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3bCZr142JkbqilsuhRLtStdjURByoUmg",
  authDomain: "languagegalaxy-f2369.firebaseapp.com",
  projectId: "languagegalaxy-f2369",
  storageBucket: "languagegalaxy-f2369.firebasestorage.app",
  messagingSenderId: "826223303597",
  appId: "1:826223303597:web:1535fdf9a9a2ec57851f24"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);       
const db = getFirestore(app);   

export { auth, db, app };