import albinaPhoto from '../assets/images/albina.png';
import mariaPhoto from '../assets/images/maria.png';
import telegramIcon from '../assets/images/telegramBlack.png';

export const mainContacts = {
    telegram: 'https://t.me/albinochka_5',
    instagram: 'https://instagram.com/albi_0_12?igshid=MzRlODBiNWFlZA==',
    email: 'mailto:albinadmytriieva@gmail.com'

}

export const personContacts = [
    {
        id: 'headmaster',
        name: 'Albina',
        title: 'the headmaster',
        photoSrc: albinaPhoto,
        desctiption: "The headmaster of the school. I'll be glad to answer your questions about the courses and help you purchase the program you liked",
        contact: { 
            type: 'telegram',
            link: 'https://t.me/albinochka_5',
            iconSrc: telegramIcon
        } 
    }, 
    {
        id: 'hr',
        name: 'Maria',
        title: 'cooperation and HR',
        photoSrc: mariaPhoto,
        desctiption: "If you have any suggestions or questions about cooperation, you can text me, we'll discuss it. I'll help you to join our friendly school community and tell about all details.",
        contact: {
            type: 'telegram',
            link: 'https://t.me/MariiaMezentseva',
            iconSrc: telegramIcon
        }
    }
]