// src/data/contactsData.js
import albinaPhoto from '../assets/images/albina.png';
import mariaPhoto from '../assets/images/maria.png';
import telegramIcon from '../assets/images/telegramBlack.png';

// Ці посилання не потребують перекладу
export const mainContacts = {
    telegram: 'https://t.me/language_galaxy', // Використовуйте загальний, а не особистий
    instagram: 'https://instagram.com/language_galaxy',
    email: 'mailto:language_galaxy@gmail.com'
};

// Залишаємо тільки те, що не перекладається
export const personContacts = [
    {
        id: 'headmaster',
        photoSrc: albinaPhoto,
        contact: { 
            type: 'telegram',
            link: 'https://t.me/albinochka_5',
            iconSrc: telegramIcon
        } 
    }, 
    {
        id: 'hr',
        photoSrc: mariaPhoto,
        contact: {
            type: 'telegram',
            link: 'https://t.me/MariiaMezentseva',
            iconSrc: telegramIcon
        }
    }
];