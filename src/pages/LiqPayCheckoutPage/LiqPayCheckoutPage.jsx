import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPayment } from '../../services/liqpay/liqpayService';
import './LiqPayCheckoutPage.css';

const LiqPayCheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializePayment = async () => {
            console.log("[LiqPayCheckoutPage] Initializing payment...");
            try {
                const orderDataFromState = location.state?.orderData;
                console.log("[LiqPayCheckoutPage] Order data from state:", orderDataFromState);

                if (!orderDataFromState || !orderDataFromState.amount || !orderDataFromState.orderId) {
                    setError('Необходимые данные для оформления заказа отсутствуют. Пожалуйста, вернитесь в корзину и попробуйте снова.');
                    console.error("LiqPayCheckoutPage: orderData from state is missing or incomplete", location.state);
                    setLoading(false);
                    return;
                }

                console.log("[LiqPayCheckoutPage] Order ID to be saved:", orderDataFromState.orderId);
                localStorage.setItem('processingOrderId', orderDataFromState.orderId);
                const retrievedId = localStorage.getItem('processingOrderId');
                console.log("[LiqPayCheckoutPage] Order ID retrieved from localStorage immediately after setItem:", retrievedId);

                console.log("[LiqPayCheckoutPage] Calling createPayment service...");
                const paymentData = await createPayment(orderDataFromState);
                console.log("[LiqPayCheckoutPage] Payment data received from service:", paymentData);

                if (!paymentData || !paymentData.data || !paymentData.signature) {
                    setError('Не удалось получить данные для формы LiqPay от сервиса.');
                    console.error("[LiqPayCheckoutPage] Invalid paymentData received from createPayment service", paymentData);
                    setLoading(false);
                    return;
                }

                const form = document.createElement('form');
                form.method = 'POST';
                form.action = 'https://www.liqpay.ua/api/3/checkout';
                form.acceptCharset = 'utf-8';
                console.log("[LiqPayCheckoutPage] Form created. Action:", form.action);

                const dataInput = document.createElement('input');
                dataInput.type = 'hidden';
                dataInput.name = 'data';
                dataInput.value = paymentData.data;
                form.appendChild(dataInput);
                console.log("[LiqPayCheckoutPage] Data input appended. Value:", paymentData.data.substring(0, 50) + "...");

                const signatureInput = document.createElement('input');
                signatureInput.type = 'hidden';
                signatureInput.name = 'signature';
                signatureInput.value = paymentData.signature;
                form.appendChild(signatureInput);
                console.log("[LiqPayCheckoutPage] Signature input appended. Value:", paymentData.signature);

                document.body.appendChild(form);
                console.log("[LiqPayCheckoutPage] Form appended to body. Submitting form...");
                form.submit();
                console.log("[LiqPayCheckoutPage] form.submit() called.");

            } catch (err) {
                setError(`Ошибка при инициализации платежа: ${err.message || 'Неизвестная ошибка'}`);
                console.error('Payment initialization error:', err);
                setLoading(false);
            }
        };

        initializePayment();
    }, [navigate, location]);

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

    return null;
};

export default LiqPayCheckoutPage;