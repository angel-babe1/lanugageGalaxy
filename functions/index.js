// functions/index.js (или src/index.ts, если вы выбрали TypeScript)

// Используем import вместо require
import * as functions from "firebase-functions";
import admin from "firebase-admin"; // Для работы с Firestore/Realtime Database
import crypto from "crypto";
// import axios from "axios"; // Если нужен для API запросов к LiqPay

// Инициализируем Firebase Admin SDK (если еще не сделано в вашем проекте)
// Это нужно для доступа к Firestore, Realtime Database и т.д.
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore(); // Используем Firestore

// Вспомогательная функция для генерации подписи LiqPay
function generateLiqPaySignature(privateKey, data) {
  const signString = privateKey + data + privateKey;
  return crypto.createHash("sha1").update(signString).digest("base64");
}

// Используем export const вместо exports.liqpayCallback = ...
export const liqpayCallback = functions
  .region("europe-west1") // Выберите регион, ближайший к вашим пользователям/LiqPay
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      console.log("LiqPay Callback: Received non-POST request.");
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const receivedData = req.body.data;
      const receivedSignature = req.body.signature;

      // Получаем приватный ключ из конфигурации Firebase Functions
      const LIQPAY_PRIVATE_KEY = functions.config().liqpay.private_key;

      if (!LIQPAY_PRIVATE_KEY) {
        console.error("LiqPay Callback: Private key not configured in Firebase functions config.");
        return res.status(500).send("Internal Server Error: Configuration error.");
      }
      if (!receivedData || !receivedSignature) {
        console.warn("LiqPay Callback: Missing 'data' or 'signature' in POST body.");
        return res.status(400).send("Bad Request: Missing data or signature.");
      }

      // 1. Проверить подпись
      const expectedSignature = generateLiqPaySignature(LIQPAY_PRIVATE_KEY, receivedData);

      if (expectedSignature !== receivedSignature) {
        console.error(`LiqPay Callback: Invalid signature. Expected: ${expectedSignature}, Received: ${receivedSignature}`);
        return res.status(400).send("Invalid signature");
      }

      // 2. Декодировать 'data'
      let paymentDetails;
      try {
        // Buffer доступен глобально в Node.js, ESLint должен его знать при env: { node: true }
        const jsonString = Buffer.from(receivedData, "base64").toString("utf-8");
        paymentDetails = JSON.parse(jsonString);
      } catch (error) {
        console.error("LiqPay Callback: Error decoding data.", error);
        return res.status(400).send("Error decoding data");
      }

      const orderId = paymentDetails.order_id;
      const status = paymentDetails.status;
      const paymentId = paymentDetails.payment_id; // ID транзакции в LiqPay
      const amount = parseFloat(paymentDetails.amount);
      const currency = paymentDetails.currency;

      console.log(`LiqPay Callback: Processing order_id=${orderId}, status=${status}, payment_id=${paymentId}`);

      // 3. Найти заказ в вашей базе данных (Firestore)
      const orderRef = db.collection("orders").doc(orderId); // Предполагаем, что у вас есть коллекция 'orders'
      const orderSnap = await orderRef.get();

      if (!orderSnap.exists) {
        console.error(`LiqPay Callback: Order ${orderId} not found in Firestore.`);
        return res.status(200).send("OK (Order not found, logged)");
      }

      const orderData = orderSnap.data();

      // 4. Идемпотентность: проверить, не был ли этот callback уже обработан
      if (orderData.liqpayPaymentId === paymentId && (orderData.status === "paid" || orderData.status === "payment_successful_sandbox")) {
        console.log(`LiqPay Callback: Order ${orderId} with paymentId ${paymentId} already processed.`);
        return res.status(200).send("OK (Already processed)");
      }

      // 5. (Опционально) Проверить сумму и валюту
      if (orderData.totalAmount !== amount || orderData.currency !== currency) {
        console.warn(`LiqPay Callback: Amount/currency mismatch for order ${orderId}. DB: ${orderData.totalAmount} ${orderData.currency}, LiqPay: ${amount} ${currency}.`);
        await orderRef.update({
          status: "review_needed_payment_mismatch",
          liqpayCallbackData: paymentDetails,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return res.status(200).send("OK (Amount mismatch, logged for review)");
      }

      // 6. Обработать статус платежа
      let newOrderStatus;
      let updatePayload = {
        liqpayPaymentId: paymentId,
        liqpayStatus: status,
        liqpayCallbackData: paymentDetails,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (status === "success") {
        newOrderStatus = "paid";
        console.log(`Order ${orderId} paid successfully.`);
      } else if (status === "sandbox") {
        newOrderStatus = "payment_successful_sandbox";
        console.log(`Order ${orderId} paid successfully in SANDBOX mode.`);
      } else if (status === "failure" || status === "error" || status === "reversed") {
        newOrderStatus = "payment_failed";
        updatePayload.liqpayErrorDescription = paymentDetails.err_description || paymentDetails.err_code || "Unknown LiqPay error";
        console.log(`Payment for order ${orderId} failed or was reversed. Status: ${status}`);
      } else {
        newOrderStatus = `payment_processing_${status}`;
        console.log(`Order ${orderId} has intermediate status: ${status}`);
      }

      updatePayload.status = newOrderStatus;
      await orderRef.update(updatePayload);

      console.log(`LiqPay Callback: Successfully processed order ${orderId}. Responding 200 OK.`);
      return res.status(200).send("OK");

    } catch (error) {
      console.error("LiqPay Callback: Unhandled error:", error);
      return res.status(500).send("Internal Server Error");
    }
  });

// Если у вас будут другие функции, экспортируйте их аналогично:
// export const другаяФункция = functions. ...