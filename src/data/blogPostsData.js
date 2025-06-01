import idiomCardImg from '../assets/images/blog/cake-slice.jpg';

const blogPostData = [
    {
        id: 'p1',
        slug: 'idioms-break-a-leg-piece-of-cake',
        title: "Що насправді означають фрази типу 'Break a leg' та 'Piece of cake'?",
        cardTitle: "Ідіоми: Break a leg та Piece of cake",
        description: 'Розбираємо походження та значення популярних англійських ідіом.',
        category: 'English',
        image: idiomCardImg
    },
    { 
        id: 'p2', 
        slug: 'top-10-travel-phrases', 
        title: 'Топ 10 фраз для подорожей', 
        description: 'Must-have для туриста', 
        category: 'English', 
        image: idiomCardImg 
    },
    { 
        id: 'p3', 
        slug: 'past-simple-grammar', 
        title: 'Граматика: Past Simple', 
        description: 'Просте пояснення', 
        category: 'English',
         image: idiomCardImg 
        },
    { 
        id: 'p4', 
        slug: 'german-articles', 
        title: 'Німецькі артиклі: Der, Die, Das', 
        description: 'Як запам\'ятати?', content: `...`, 
        category: 'German', 
        image: idiomCardImg 
    },
    { 
        id: 'p5', 
        slug: 'another-general-tip', 
        title: 'Ще одна загальна порада', 
        description: 'Дуже важливо!', 
        content: `...`, 
        category: 'General', 
        image: idiomCardImg 
    }
];

const allCategories = blogPostData.map(post => post.category);
const uniqueCategories = new Set(allCategories);
export const blogCategories = ['All', ...uniqueCategories];

export default blogPostData;