import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import blogPostsData from "../data/blogPostsData"; 
import CallToActionBlock from "../components/common/CallToActionBlock/CallToActionBlock";
import Loader from '../components/common/Loader/Loader'; 
import './BlogPostPage.css';

const markdownModules = import.meta.glob('../content/posts/*/*.md', { query: '?raw', eager: true });

function BlogPostPage() {
    const { postSlug } = useParams();
    const { i18n, t } = useTranslation(); 
    const currentLanguage = i18n.language;

    const [postContent, setPostContent] = useState('');
    const [postMeta, setPostMeta] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        setError(false);

        const meta = blogPostsData.find(p => p.slug === postSlug);
        if (!meta) {
            console.error(`Post metadata not found for slug: ${postSlug}`);
            setError(true);
            setIsLoading(false);
            return;
        }

        const translatedMeta = {
            ...meta,
            ...t(`blogPage.posts.${meta.id}`, { returnObjects: true })
        };
        setPostMeta(translatedMeta);

        const path = `../content/posts/${postSlug}/${currentLanguage}.md`;
        const content = markdownModules[path]?.default;
        
        if (content) {
            setPostContent(content);
        } else {
            console.warn(`Markdown content not found for path: ${path}`);
            setError(true); 
        }

        setIsLoading(false);

    }, [postSlug, currentLanguage, t]);

    if (isLoading) {
        return <Loader />; 
    }

    if (error || !postMeta) {
        return (
            <main className="blog-post-page-main error-page">
                <div className="container">
                    <h1>{t('blogPost.notFoundTitle', 'Пост не знайдено')}</h1>
                    <p>{t('blogPost.notFoundMessage', 'На жаль, статтю не знайдено або для неї немає перекладу.')}</p>
                    <Link to="/blog">{t('blogPost.backToBlog', '← Повернутись до блогу')}</Link>
                </div>
            </main>
        );
    }

    const markdownComponents = {
        h2: ({ node, ...props }) => <h2 className="markdown-h2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="markdown-h3" {...props} />,
        p: ({ node, ...props }) => <p className="markdown-p" {...props} />,
        ul: ({ node, ...props }) => <ul className="markdown-ul" {...props} />,
        li: ({ node, ...props }) => <li className="markdown-li" {...props} />,
        a: ({ node, ...props }) => <a className="markdown-a" target="_blank" rel="noopener noreferrer" {...props} />,
        img: ({ node, src, alt, ...props }) => {
            const imageUrl = src.startsWith('/') ? src : `/${src}`;
            return <img src={imageUrl} alt={alt || ''} className="markdown-img" {...props} />;
        },
        strong: ({ node, ...props }) => <strong className="markdown-strong" {...props} />,
        em: ({ node, ...props }) => <em className="markdown-em" {...props} />,
    };

    return (
        <main className="blog-post-page-main">
            <div className="container blog-post-container">
                <Link to="/blog" className="back-to-blog-link">
                    {t('blogPost.backToBlog', '← Повернутись до блогу')}
                </Link>

                <article className="blog-post-content">
                    <h1>{postMeta.title || postMeta.cardTitle}</h1>
                    <div className="post-meta">
                        <span>Категорія: {t(`blogPage.categories.${postMeta.categoryKey}`)}</span>
                    </div>

                    <div className="markdown-body">
                        <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                            {postContent}
                        </ReactMarkdown>
                    </div>

                    <CallToActionBlock />
                </article>
            </div>
        </main>
    );
}

export default BlogPostPage;