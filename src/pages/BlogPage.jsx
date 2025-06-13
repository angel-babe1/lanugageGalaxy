import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CategoryFilter from '../components/blog/CategoryFilter/CategoryFilter';
import BlogCard from '../components/blog/BlogCard/BlogCard';
import Pagination from '../components/blog/Pagination/Pagination';
import blogPostsData, { blogCategoriesKeys } from '../data/blogPostsData';
import './BlogPage.css';

const POSTS_PER_PAGE = 3;

function BlogPage() {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    const translatedPosts = blogPostsData.map(post => ({
        ...post,
        ...t(`blogPage.posts.${post.id}`, { returnObjects: true })
    }));
    setAllPosts(translatedPosts);
  }, [i18n.language, t]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') {
      return allPosts;
    }
    return allPosts.filter(post => post.categoryKey === selectedCategory);
  }, [selectedCategory, allPosts]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const displayedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <main className="blog-page-main">
      <div className="container">
        <h1 className="blog-title">{t('blogPage.title')}</h1>

        <CategoryFilter
          categories={blogCategoriesKeys} 
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />

        {displayedPosts.length > 0 ? (
          <div className="blog-grid">
            {displayedPosts.map((post) => (
              <BlogCard
                key={post.id}
                slug={post.slug}
                title={post.cardTitle}
                description={post.description}
                image={post.image}
              />
            ))}
          </div>
        ) : (
          <p className="no-posts-message">{t('blogPage.noPostsMessage')}</p>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </main>
  );
}

export default BlogPage;