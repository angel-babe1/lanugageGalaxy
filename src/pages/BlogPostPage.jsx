import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import blogPostData from "../data/blogPostsData";
import CallToActionBlock from "../components/common/CallToActionBlock/CallToActionBlock";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import './BlogPostPage.css';

function BlogPostPage() {
    const { postSlug } = useParams();
    const [postContent, setPostContent] = useState('');
    const [postMeta, setPostMeta] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        setError(false);
        setPostContent('');
        setPostMeta(null);

        console.log('Attempting to load pot with SLUG:', postSlug);

        const meta = blogPostData.find(p => p.slug === postSlug);
        console.log('Found metadata by slug:', meta);

        if (!meta) {
            console.error(`Post metadata not found for id: ${postSlug}`);
            setError(true);
            setIsLoading(false);
            return;
        }
        setPostMeta(meta);

        const mdFileName = meta.slug;
        console.log('Expecting markdown file:', mdFileName);

        const importPath = `../content/posts/${mdFileName}.md`;
        console.log('Attempting to dynamically import:', importPath);

        import(`../content/posts/${mdFileName}.md?raw`)
            .then(module => {
                console.log('Markdown content loaded successfully.');
                setPostContent(module.default);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error loading markdown file with ?raw:", err);
                setError(true);
                setIsLoading(false);
            });

    }, [postSlug]);

    if (isLoading) {
        return <div>Завантаження статті...</div>;
    }

    if (error || !postMeta) {
        return (
            <>
                {/* <Header /> */}
                <main className="blog-post-page-main error-page">
                    <div className="container">
                        <h1>Помилка</h1>
                        <p>На жаль, статтю не знайдено.</p>
                        <Link to="/">Повернутись до головної</Link>
                    </div>
                </main>
                {/* <Footer /> */}
            </>
        );
    }

    const markdownComponents = {
        // Добавляем классы для стилизации
        h2: ({ node, ...props }) => <h2 className="markdown-h2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="markdown-h3" {...props} />,
        p: ({ node, ...props }) => <p className="markdown-p" {...props} />,
        ul: ({ node, ...props }) => <ul className="markdown-ul" {...props} />,
        li: ({ node, ...props }) => <li className="markdown-li" {...props} />,
        a: ({ node, ...props }) => <a className="markdown-a" target="_blank" rel="noopener noreferrer" {...props} />,
        img: ({ node, src, alt, ...props }) => {
            // Обработка картинок из Markdown (если они в public)
            // Если путь не абсолютный, добавляем /
            const imageUrl = src.startsWith('/') ? src : `/${src}`;
            return <img src={imageUrl} alt={alt || ''} className="markdown-img" {...props} />;
        },
        strong: ({ node, ...props }) => <strong className="markdown-strong" {...props} />,
        em: ({ node, ...props }) => <em className="markdown-em" {...props} />,
    };

    return (
        <>
            <main className="blog-post-page-main">
                <div className="container blog-post-container">
                    <Link to="/blog" className="back-to-blog-link">← Назад до блогу</Link>

                    <article className="blog-post-content">
                        <h1>{postMeta.title}</h1>
                        <div className="post-meta">
                            <span>Категорія: {postMeta.category}</span>
                        </div>

                        <div className="markdown-body">
                            <ReactMarkdown components={markdownComponents}>
                                {postContent}
                            </ReactMarkdown>
                        </div>

                        <CallToActionBlock />
                    </article>
                </div>
            </main>
        </>
    )
}

export default BlogPostPage;