// Импортируйте сюда ваши будущие изображения для карточек игр
import japaneseGameImg from '../assets/images/games/japanese-cards.avif';
import koreanGameImg from '../assets/images/games/korean-pair.jpg';
import chineseGameImg from '../assets/images/games/chinese-sentence.jpg';
import englishGameImg from '../assets/images/games/english-quiz.jpeg';

const gamesData = [
    {
        id: 'g1',
        slug: 'japanese-flashcards',
        language: 'Японська',
        title: 'Інтерактивні картки',
        description: 'З\'єднай зображення з правильною назвою японською мовою, щоб вивчити нові слова.',
        image: japaneseGameImg 
    },
    {
        id: 'g2',
        slug: 'korean-memory-match',
        language: 'Корейська',
        title: 'Знайди пару',
        description: 'Перевертай картки та знаходь пари слів або символів. Тренуй пам\'ять та лексику.',
        image: koreanGameImg 
    },
    {
        id: 'g3',
        slug: 'chinese-sentence-builder',
        language: 'Китайська',
        title: 'Склади речення',
        description: 'Перетягуй слова, щоб скласти граматично правильні речення китайською мовою.',
        image: chineseGameImg 
    },
    {
        id: 'g4',
        slug: 'english-quiz',
        language: 'Англійська',
        title: 'Вибери правильну відповідь',
        description: 'Перевір свої знання граматики та лексики, обираючи правильний варіант з кількох.',
        image: englishGameImg 
    }
];

export default gamesData;