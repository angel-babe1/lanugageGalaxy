import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import StudyingPage from './pages/StudyingPage';
import BlogPage from './pages/BlogPage';
import GamesPage from './pages/GamesPage';
import ContactsPage from './pages/ContactsPage';
import TeachersPage from './pages/TeachersPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import ReviewsPage from './pages/ReviewsPage';
import FaqPage from './pages/FaqPage';
import BlogPostPage from './pages/BlogPostPage';
import LanguageCoursePage from './pages/LanguageCoursePage';
import CourseDetailPage from './pages/CourseDetailPage/CourseDetailPage';
import CartPage from './pages/CartPage/CartPage';
import PaymentResultPage from './pages/PaymentResultPage/PaymentResultPage.jsx';
import LiqPayCheckoutPage from './pages/LiqPayCheckoutPage/LiqPayCheckoutPage.jsx';

import JapaneseFlashcardsGame from './pages/games/JapaneseFlashcardsGame/JapaneseFlashcardsGame.jsx';
import KoreanMemoryGame from './pages/games/KoreanMemoryGame/KoreanMemoryGame.jsx';
import ChineseSentenceGame from './pages/games/ChineseSentenceGame/ChineseSentenceGame.jsx';
import EnglishQuizGame from './pages/games/EnglishQuizGame/EnglishQuizGame.jsx';

import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
// import Cart from './components/Cart/Cart';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className='main-content'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/studying' element={<StudyingPage />} />
          <Route path='/studying/:languageId' element={<LanguageCoursePage />} />
          <Route path='/courses/:courseSlug' element={<CourseDetailPage />} />
          <Route path='/blog' element={<BlogPage />} />
          <Route path="/blog/:postSlug" element={<BlogPostPage />} />
          <Route path='/games' element={<GamesPage />} />
          <Route path="/games/japanese-flashcards" element={<JapaneseFlashcardsGame />} />
          <Route path="/games/korean-memory-match" element={<KoreanMemoryGame />} />
          <Route path="/games/chinese-sentence-builder" element={<ChineseSentenceGame />} />
           <Route path="/games/english-quiz" element={<EnglishQuizGame />} />
          <Route path='/contacts' element={<ContactsPage />} />
          <Route path='/teachers' element={<TeachersPage />} />
          <Route path='/registrate' element={<SignUpPage />} />
          <Route path='/reviews' element={<ReviewsPage />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/faq' element={<FaqPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/payment-result' element={<PaymentResultPage />} />
          <Route path='/checkout/liqpay' element={<LiqPayCheckoutPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
