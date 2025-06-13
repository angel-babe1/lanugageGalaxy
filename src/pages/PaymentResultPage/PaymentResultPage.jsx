import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPaymentStatus } from '../../services/liqpay/liqpayService';
import { useCart } from '../../content/CartContext';
import './PaymentResultPage.css';

const PaymentResultPage = () => {
    const navigate = useNavigate();
    const { clearCart } = useCart(); 
    const [statusInfo, setStatusInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

     useEffect(() => {
        const fetchAndUpdateStatus = async () => {
            setLoading(true);
            setError(null);
            
            const processingOrderId = localStorage.getItem('processingOrderId');
            console.log("[PaymentResultPage] Retrieved orderId from localStorage:", processingOrderId);

            if (!processingOrderId) {
                setError("Не вдалося визначити номер замовлення для перевірки статусу.");
                setLoading(false);
                return;
            }

            try {
                const statusResult = await getPaymentStatus(processingOrderId);
                setStatusInfo(statusResult);
                console.log("[PaymentResultPage] Status from backend:", statusResult);

                if (statusResult && (statusResult.status === 'success' || statusResult.status === 'sandbox')) {
                    console.log("[PaymentResultPage] Payment successful, clearing cart.");
                    clearCart();
                } else if (statusResult) {
                    setError(statusResult.err_description || `Платіж не успішний. Статус: ${statusResult.status}`);
                }
            } catch (err) {
                console.error('[PaymentResultPage] Помилка при запиті статусу платежу:', err);
                setError(err.message || 'Сталася помилка під час перевірки статусу платежу.');
            } finally {
                setLoading(false);
                localStorage.removeItem('processingOrderId');
                console.log("[PaymentResultPage] Removed orderId from localStorage.");
            }
        };

        const timer = setTimeout(fetchAndUpdateStatus, 2000); 

        return () => clearTimeout(timer);
    }, [clearCart]);

    const handleReturn = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="result-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Перевіряємо статус вашого платежу...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="result-container error-message">
                <h2>Помилка обробки платежу</h2>
                <p>{error}</p>
                <button onClick={handleReturn}>Повернутись на головну</button>
            </div>
        );
    }

    if (statusInfo) {
        const isSuccess = statusInfo.status === 'success' || statusInfo.status === 'sandbox';
        return (
            <div className="result-container">
                <div className={`payment-status ${isSuccess ? 'success' : 'failure'}`}>
                    <h2>{isSuccess ? 'Оплата успішно виконана!' : 'Помилка оплати'}</h2>
                    <p>{isSuccess ? 'Дякуємо за ваше замовлення!' : (statusInfo.err_description || 'Будь ласка, спробуйте ще раз.')}</p>
                    <div className="payment-details">
                        {statusInfo.order_id && <p>Номер замовлення: {statusInfo.order_id}</p>}
                        {statusInfo.amount && <p>Сума: {statusInfo.amount} {statusInfo.currency}</p>}
                    </div>
                    <button onClick={handleReturn}>Повернутись на головну</button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="result-container">
            <p>Не вдалося завантажити інформацію про ваш платіж.</p>
            <button onClick={handleReturn}>Повернутись на головну</button>
        </div>
    );
};

export default PaymentResultPage;