// // liqpayInit.js
// const script = document.createElement('script');
// script.src = 'https://static.liqpay.ua/libjs/checkout.js';
// script.async = true;

// export const initLiqPay = () => {
//     console.log("[initLiqPay] Called.");
//     if (!document.querySelector(`script[src="${script.src}"]`)) {
//         console.log("[initLiqPay] Appending LiqPay SDK script to head.");
//         document.head.appendChild(script);
//     } else {
//         console.log("[initLiqPay] LiqPay SDK script already in head.");
//     }

//     return new Promise((resolve, reject) => {
//         let attempts = 0;
//         const maxAttempts = 50; // Ждем примерно 5 секунд

//         const checkLiqPaySDK = () => {
//             attempts++;
//             console.log(`[initLiqPay] Checking for window.LiqPay, attempt ${attempts}`);
//             if (window.LiqPay && typeof window.LiqPay === 'function') {
//                 try {
//                     // Проверяем, является ли это действительно конструктором
//                     new window.LiqPay("test_public_key", "test_private_key");
//                     console.log("[initLiqPay] window.LiqPay is a valid constructor. Resolving.");
//                     resolve(window.LiqPay);
//                 } catch (e) {
//                     // Это не конструктор, SDK может быть еще не полностью готов
//                     console.warn("[initLiqPay] window.LiqPay exists but is not a constructor yet, retrying...", e);
//                     if (attempts < maxAttempts) {
//                         setTimeout(checkLiqPaySDK, 100);
//                     } else {
//                         console.error("[initLiqPay] Max attempts reached. Failed to initialize LiqPay SDK.");
//                         reject(new Error("Failed to initialize LiqPay SDK after multiple attempts."));
//                     }
//                 }
//             } else if (attempts < maxAttempts) {
//                 setTimeout(checkLiqPaySDK, 100);
//             } else {
//                 console.error("[initLiqPay] Max attempts reached. window.LiqPay not found or not a function.");
//                 reject(new Error("window.LiqPay not found or not a function after multiple attempts."));
//             }
//         };

//         // Обработчики загрузки скрипта
//         script.onload = () => {
//             console.log("[initLiqPay] LiqPay SDK script loaded (onload event).");
//             checkLiqPaySDK(); // Начинаем проверку после загрузки
//         };
//         script.onerror = () => {
//             console.error("[initLiqPay] Failed to load LiqPay SDK script (onerror event).");
//             reject(new Error("Failed to load LiqPay SDK script."));
//         };

//         // Если скрипт уже был на странице и загружен (например, при HMR)
//         if (document.querySelector(`script[src="${script.src}"]`) && window.LiqPay && typeof window.LiqPay === 'function') {
//              try {
//                 new window.LiqPay("test_public_key", "test_private_key");
//                 console.log("[initLiqPay] LiqPay SDK already loaded and valid constructor. Resolving early.");
//                 resolve(window.LiqPay);
//                 return; // Выходим, чтобы не устанавливать onload/onerror заново, если скрипт уже есть
//              } catch(e) {
//                 console.warn("[initLiqPay] LiqPay SDK script present, but not a constructor yet. Waiting for onload.");
//              }
//         }
//         // Если скрипт еще не добавлен (хотя мы его добавляем выше), или если onload еще не сработал,
//         // мы все равно можем начать проверку, так как он мог быть добавлен другим способом или загрузиться очень быстро.
//         // Но основной триггер для checkLiqPaySDK - это script.onload.
//         // Если скрипт добавляется впервые, checkLiqPaySDK вызовется из script.onload.
//         // Если скрипт уже был, мы пытаемся разрешить его немедленно.
//     });
// };