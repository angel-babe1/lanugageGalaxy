export const createPayment = async (orderData) => {
    console.log("[Client liqpayService] createPayment called with orderData:", orderData);
    try {
        const preparePaymentFunctionUrl = "https://prepareliqpaypaymentdata-mhmryvx76q-ew.a.run.app";

        const response = await fetch(preparePaymentFunctionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                orderId: orderData.orderId,
                amount: orderData.amount,
                description: orderData.description,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Unknown server error or non-JSON response" }));
            console.error("[Client liqpayService] Error from prepareLiqPayPaymentData function:", response.status, errorData);
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const paymentFormParams = await response.json();
        console.log("[Client liqpayService] Received form params from backend:", paymentFormParams);

        if (!paymentFormParams || !paymentFormParams.data || !paymentFormParams.signature) {
            console.error("[Client liqPayService] Invalid data/signature received from backend.", paymentFormParams);
            throw new Error("Неможливо отримати коректні параметри для форми LiqPay від сервера.");
        }

        return {
            data: paymentFormParams.data,
            signature: paymentFormParams.signature,
        };

    } catch (error) {
        console.error('[Client liqpayService] Error in createPayment while fetching from backend:', error);
        if (error.message.includes("Failed to fetch")) {
            throw new Error("Помилка мережі під час звернення до сервера для підготовки платежу. Перевірте ваше інтернет-з'єднання.");
        }
        throw error; 
    }
};

export const getPaymentStatus = async (orderId) => {
    console.log("[Client liqpayService] getPaymentStatus called for orderId:", orderId);
    if (!orderId) {
        console.error("[Client liqpayService] orderId is required for getPaymentStatus.");
        throw new Error("orderId is required to get payment status.");
    }

    try {
        const getStatusFunctionUrl = "https://getliqpayorderstatus-mhmryvx76q-ew.a.run.app";

        const response = await fetch(`${getStatusFunctionUrl}?orderId=${encodeURIComponent(orderId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseData = await response.json(); 

        if (!response.ok) {
            console.error("[Client liqPayService] Error from getLiqPayOrderStatus function:", response.status, responseData);
            throw new Error(responseData.error || responseData.details || `Server error while fetching status: ${response.status}`);
        }

        console.log("[Client liqpayService] Received payment status from backend:", responseData);
        return responseData; 

    } catch (error) {
        console.error('[Client liqpayService] Error in getPaymentStatus:', error);
        if (error.message.includes("Failed to fetch")) {
            throw new Error("Помилка мережі під час запиту статусу платежу. Перевірте інтернет-з'єднання.");
        }
        throw error; 
    }
};
