// Импортируем скрипт LiqPay
const script = document.createElement('script');
script.src = 'https://static.liqpay.ua/libjs/checkout.js';
document.body.appendChild(script);

// Создаем глобальный объект LiqPay
window.LiqPay = window.LiqPay || {};

export const initLiqPay = () => {
    return new Promise((resolve) => {
        script.onload = () => {
            resolve(window.LiqPay);
        };
    });
}; 