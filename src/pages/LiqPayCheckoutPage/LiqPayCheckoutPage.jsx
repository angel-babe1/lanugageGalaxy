import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation уже импортирован
import { createPayment } from '../../services/liqpay/liqpayService'; // Убедитесь, что путь правильный
import './LiqPayCheckoutPage.css';

const LiqPayCheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Используем для получения state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializePayment = async () => {
            try {
                // Получаем данные заказа из location.state, переданные из CartPage
                const orderDataFromState = location.state?.orderData;

                if (!orderDataFromState || !orderDataFromState.amount || !orderDataFromState.orderId) {
                    setError('Необходимые данные для оформления заказа отсутствуют. Пожалуйста, вернитесь в корзину и попробуйте снова.');
                    console.error("LiqPayCheckoutPage: orderData from state is missing or incomplete", location.state);
                    setLoading(false);
                    // Можно добавить кнопку для возврата в корзину или автоматический редирект
                    // setTimeout(() => navigate('/cart'), 5000);
                    return;
                }

                // Используем полученные данные заказа для создания платежа
                const paymentData = await createPayment(orderDataFromState); // orderDataFromState это {amount, description, orderId}

                // Создаем форму для отправки на LiqPay - ВАШ КОД УЖЕ ЭТО ДЕЛАЕТ ПРАВИЛЬНО
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = 'https://www.liqpay.ua/api/3/checkout';
                form.acceptCharset = 'utf-8';

                const dataInput = document.createElement('input');
                dataInput.type = 'hidden';
                dataInput.name = 'data';
                dataInput.value = paymentData.data; // paymentData.data приходит из createPayment
                form.appendChild(dataInput);

                const signatureInput = document.createElement('input');
                signatureInput.type = 'hidden';
                signatureInput.name = 'signature';
                signatureInput.value = paymentData.signature; // paymentData.signature приходит из createPayment
                form.appendChild(signatureInput);

                document.body.appendChild(form);
                form.submit();
                // document.body.removeChild(form); // Удалять форму лучше после небольшой задержки или не удалять, если редирект происходит сразу

            } catch (err) {
                setError(`Ошибка при инициализации платежа: ${err.message || 'Неизвестная ошибка'}`);
                console.error('Payment initialization error:', err);
                setLoading(false); // Важно сбросить loading при ошибке
            }
            // finally { setLoading(false); } // setLoading(false) здесь не нужен, т.к. происходит редирект или ошибка
        };

        initializePayment();
    }, [navigate, location]); // Добавили location в зависимости

    if (loading) {
        return (
            <div className="checkout-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Перенаправляем на страницу оплаты LiqPay...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="checkout-container">
                <div className="error-message">
                    <h2>Ошибка инициализации платежа</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/cart')}>Вернуться в корзину</button>
                </div>
            </div>
        );
    }

    // Этот return обычно не достигается, так как либо происходит редирект, либо отображается ошибка/загрузка
    return null;
};

export default LiqPayCheckoutPage;