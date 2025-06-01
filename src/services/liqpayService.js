import { LiqPay } from 'liqpay-sdk';

// Инициализация LiqPay с вашими ключами
const liqpay = new LiqPay(process.env.REACT_APP_LIQPAY_PUBLIC_KEY, process.env.REACT_APP_LIQPAY_PRIVATE_KEY);

export const createPayment = async (orderData) => {
    try {
        const params = {
            version: '3',
            action: 'pay',
            amount: orderData.amount,
            currency: 'UAH',
            description: orderData.description,
            order_id: orderData.orderId,
            result_url: `${window.location.origin}/payment-result`,
            server_url: `${window.location.origin}/api/payment-callback`,
            language: 'uk',
            sandbox: process.env.NODE_ENV === 'development' ? 1 : 0
        };

        // Создаем подпись для платежа
        const data = liqpay.cnb_object(params);
        const signature = liqpay.cnb_signature(params);

        return {
            data,
            signature,
            params
        };
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
};

export const verifyPayment = (data, signature) => {
    try {
        return liqpay.str_to_sign(data) === signature;
    } catch (error) {
        console.error('Error verifying payment:', error);
        return false;
    }
};

export const getPaymentStatus = async (orderId) => {
    try {
        const params = {
            version: '3',
            action: 'status',
            order_id: orderId
        };

        const response = await liqpay.api('request', params);
        return response;
    } catch (error) {
        console.error('Error getting payment status:', error);
        throw error;
    }
}; 