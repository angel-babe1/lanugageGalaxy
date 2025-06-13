import idiomCardImg from '../assets/images/blog/cake-slice.jpg';
import japanImg from '../assets/images/blog/japanese-culture.jpg';
import clockPastImg from '../assets/images/blog/clockPastImg.jpg';
import koreanBowImg from '../assets/images/blog/korean-bow.jpg';
import chineseImg from '../assets/images/blog/chinese-question.jpg';

const blogPostsData = [
    { id: 'p1', slug: 'idioms-break-a-leg-piece-of-cake', categoryKey: 'english', image: idiomCardImg },
    { id: 'p2', slug: 'japanese-culture', categoryKey: 'japanese', image: japanImg },
    { id: 'p3', slug: 'past-simple-grammar', categoryKey: 'english', image: clockPastImg },
    { id: 'p4', slug: 'being-polite-in-korean', categoryKey: 'korean', image: koreanBowImg },
    { id: 'p5', slug: 'questions-in-chinese', categoryKey: 'chinese', image: chineseImg }
];

export const blogCategoriesKeys = ['all', 'english', 'japanese', 'korean', 'chinese'];

export default blogPostsData;