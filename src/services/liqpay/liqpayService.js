import { initLiqPay } from './liqpayInit';

let liqpayInstance = null;

const getLiqPayInstance = async () => {
    if (!liqpayInstance) {
        const LiqPay = await initLiqPay();
        liqpayInstance = new LiqPay(process.env.REACT_APP_LIQPAY_PUBLIC_KEY, process.env.REACT_APP_LIQPAY_PRIVATE_KEY);
    }
    return liqpayInstance;
};

export const createPayment = async (orderData) => {
    try {
        const liqpay = await getLiqPayInstance();

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
            // paytypes: 'card,liqpay,privat24,masterpass,visa_checkout,google_pay,apple_pay', // Опционально: доступные методы оплаты
        };

        // Создаем подпись для платежа
        const dataForLiqPay = Buffer.from(JSON.stringify(params)).toString('base64'); // data - это JSON-строка параметров, закодированная в Base64
        const signatureForLiqPay = liqpay.cnb_signature(params);

        return {
            data: dataForLiqPay, // Это должно быть base64 от JSON(params)
            signature: signatureForLiqPay, // Это подпись: base64(sha1(private_key + data + private_key))
            params // Возвращаем также исходные params, может пригодиться
        };
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
};

export const verifyPayment = (data, receivedSignature) => {
    try {
        const liqpay = liqpayInstance; // Предполагаем, что он уже инициализирован
        if (!liqpay) throw new Error("LiqPay instance not initialized for verification");
        const expectedSignature = liqpay.str_to_sign(process.env.REACT_APP_LIQPAY_PRIVATE_KEY + data + process.env.REACT_APP_LIQPAY_PRIVATE_KEY);
        return expectedSignature === receivedSignature;
    } catch (error) {
        console.error('Error verifying payment on client:', error);
        return false;
    }
};

export const getPaymentStatus = async (orderId) => {
    try {
        const liqpay = await getLiqPayInstance();
        const params = {
            version: '3',
            action: 'status',
            order_id: orderId
        };

        return new Promise((resolve, reject) => {
            liqpay.api("request", params, (json) => { // `request` это путь к API, например `payment/status`
                resolve(json);
            }, (err, data_err) => {
                console.error("LiqPay API error (getPaymentStatus):", err, data_err);
                reject(err || data_err || new Error("Failed to get payment status from LiqPay API"));
            });
        });
    } catch (error) {
        console.error('Error getting payment status:', error);
        throw error;
    }
};
