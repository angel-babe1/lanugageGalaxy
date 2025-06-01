// src/pages/PaymentResultPage/PaymentResultPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPaymentStatus } from '../../services/liqpay/liqpayService'; // verifyPayment удален, т.к. не используется здесь
import { useCart } from '../../content/CartContext';
import './PaymentResultPage.css';

const PaymentResultPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { clearCart, cartItems } = useCart(); // cartItems для проверки перед очисткой
    const [paymentStatus, setPaymentStatus] = useState(null); // Изменено на paymentStatus
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkPaymentStatus = async () => {
            setLoading(true);
            setError(null);
            setPaymentStatus(null); // Сбрасываем предыдущий статус

            try {
                const searchParams = new URLSearchParams(location.search);
                const data = searchParams.get('data');
                const signature = searchParams.get('signature'); // signature здесь не используется для проверки, но может быть полезен для логирования

                if (!data) { // signature может и не прийти, если это был не редирект с формы LiqPay, а прямой заход
                    throw new Error("Отсутствует параметр 'data' в URL.");
                }

                let decodedData;
                let orderId;
                try {
                    decodedData = JSON.parse(atob(data)); // atob() для base64
                    orderId = decodedData.order_id;
                } catch (e) {
                    console.error("Ошибка декодирования 'data':", e);
                    throw new Error("Не удалось декодировать данные платежа из URL.");
                }

                if (!orderId) {
                    throw new Error('Не удалось извлечь order_id из данных платежа.');
                }

                // Основной источник правды - запрос статуса к API LiqPay
                const statusResult = await getPaymentStatus(orderId);
                setPaymentStatus(statusResult); // Устанавливаем полученный статус

                if (statusResult && (statusResult.status === 'success' || statusResult.status === 'sandbox')) {
                    // Очищаем корзину только если она не пуста и платеж успешен
                    if (cartItems && cartItems.length > 0) {
                        clearCart();
                        console.log("Корзина очищена после успешной оплаты заказа:", orderId);
                    }
                } else if (statusResult) {
                     console.warn(`Платеж для заказа ${orderId} не успешен. Статус: ${statusResult.status}, Описание: ${statusResult.err_description || 'Нет описания'}`);
                } else {
                    console.warn(`Не удалось получить статус для заказа ${orderId}. Ответ от getPaymentStatus был пуст.`);
                }

            } catch (err) {
                console.error('PaymentResultPage - Ошибка обработки статуса платежа:', err);
                setError(err.message || 'Произошла ошибка при проверке статуса платежа.');
            } finally {
                setLoading(false);
            }
        };

        checkPaymentStatus();
    }, [location.search, clearCart, cartItems]); // Используем location.search, т.к. именно его изменение важно
                                           // cartItems добавлен, чтобы re-run не происходил при его изменении,
                                           // но его актуальное значение используется внутри

    const handleReturn = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="result-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Проверка статуса платежа...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="result-container">
                <div className="error-message">
                    <h2>Ошибка обработки платежа</h2>
                    <p>{error}</p>
                    <button onClick={handleReturn}>Вернуться на главную</button>
                </div>
            </div>
        );
    }

    // Отображение информации о платеже
    if (paymentStatus) {
        const isSuccess = paymentStatus.status === 'success' || paymentStatus.status === 'sandbox';
        return (
            <div className="result-container">
                <div className={`payment-status ${paymentStatus.status}`}>
                    <h2>
                        {isSuccess
                            ? 'Оплата успешно выполнена!'
                            : `Статус платежа: ${paymentStatus.err_description || paymentStatus.status || 'Неизвестен'}`}
                    </h2>
                    <p>
                        {isSuccess
                            ? 'Спасибо за ваш заказ!'
                            : 'Пожалуйста, проверьте детали или свяжитесь с поддержкой.'}
                    </p>
                    <div className="payment-details">
                        {paymentStatus.order_id && <p>Номер заказа: {paymentStatus.order_id}</p>}
                        {paymentStatus.amount && <p>Сумма: {paymentStatus.amount} {paymentStatus.currency}</p>}
                        {paymentStatus.payment_id && <p>ID платежа: {paymentStatus.payment_id}</p>}
                        {/* Можно добавить дату платежа, если она есть: paymentStatus.end_date */}
                    </div>
                    <button onClick={handleReturn}>
                        Вернуться на главную
                    </button>
                </div>
            </div>
        );
    }

    // Если не загрузка, нет ошибки, но и статуса нет (маловероятно, но для полноты)
    return (
        <div className="result-container">
            <p>Не удалось загрузить информацию о вашем платеже. Пожалуйста, попробуйте обновить страницу или свяжитесь с поддержкой.</p>
            <button onClick={handleReturn}>Вернуться на главную</button>
        </div>
    );
};

export default PaymentResultPage;