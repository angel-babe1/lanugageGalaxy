import React, { useState, useMemo } from 'react';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import CategoryFilter from '../components/blog/CategoryFilter/CategoryFilter';
import BlogCard from '../components/blog/BlogCard/BlogCard';
import Pagination from '../components/blog/Pagination/Pagination';
import blogPostsData, { blogCategories } from '../data/blogPostsData'; // Импорт данных и категорий
import './BlogPage.css';

const POSTS_PER_PAGE = 3; // Сколько постов на странице

function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All'); // Начинаем со "Все статьи"
  const [currentPage, setCurrentPage] = useState(1);

  // Фильтрация постов
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') {
      return blogPostsData;
    }
    return blogPostsData.filter(post => post.category === selectedCategory);
  }, [selectedCategory]);

  // Пагинация
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const displayedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  // Обработчики
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Сбрасываем на первую страницу при смене категории
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <main className="blog-page-main">
        <div className="container">
          <h1 className="blog-title">Blog</h1>

          {/* Фильтр категорий */}
          <CategoryFilter
            categories={blogCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />

          {/* Сетка постов */}
          {displayedPosts.length > 0 ? (
            <div className="blog-grid">
              {displayedPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.id} // Передаем id
                  slug={post.slug} // Передаем slug
                  // Используем cardTitle если он есть, иначе обычный title
                  title={post.cardTitle || post.title}
                  description={post.description}
                  // Картинка уже импортирована в blogPostsData.js
                  image={post.image}
                />
              ))}
            </div>
          ) : (
            <p className="no-posts-message">Немає статей у цій категорії.</p>
          )}


          {/* Пагинация */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

        </div>
      </main>
    </>
  );
}

export default BlogPage;