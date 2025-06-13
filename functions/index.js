import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import admin from "firebase-admin";
import crypto from "crypto";


import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const LiqPay = require("liqpay"); 

setGlobalOptions({ region: "europe-west1" });

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

function generateLiqPaySignature(privateKey, data) {
  const signString = String(privateKey) + String(data) + String(privateKey);
  return crypto.createHash("sha1").update(signString).digest("base64");
}

const HARDCODED_PUBLIC_KEY = "sandbox_i74192380492";
const HARDCODED_PRIVATE_KEY = "sandbox_JjPWjFY76zw55AqgnytGsNa43U7faPWar47izira";
const HARDCODED_SANDBOX_MODE = 1;
const HARDCODED_RESULT_URL = "https://languagegalaxy-f2369.web.app/payment-result";
const HARDCODED_SERVER_URL_CALLBACK = "https://liqpaycallback-mhmryvx76q-ew.a.run.app";
// ----------------------------------------------------

export const liqpayCallback = onRequest(
  { region: "europe-west1", cors: true },
  async (req, res) => {
    console.log("liqpayCallback: Invoked (HARDCODED KEYS TEST). Method:", req.method);
    if (req.method !== "POST") {
      console.warn("liqpayCallback: Received non-POST request.");
      return res.status(405).send("Method Not Allowed");
    }
    console.log("liqpayCallback: Request body (data part - first 100 chars):", {
      data: String(req.body.data).substring(0,100) + (String(req.body.data).length > 100 ? "..." : ""),
      signature: req.body.signature
    });
    try {
      const receivedData = req.body.data;
      const receivedSignature = req.body.signature;
      const PRIVATE_KEY = HARDCODED_PRIVATE_KEY;

      if (!PRIVATE_KEY) {
        console.error("liqpayCallback: (Hardcoded) Private key is missing!");
        return res.status(500).send("Internal Server Error: LiqPay private key misconfigured.");
      }
      if (!receivedData || !receivedSignature) {
        console.warn("liqpayCallback: Missing data/signature in POST body.");
        return res.status(400).send("Bad Request: Missing data/signature.");
      }
      const calculatedSignature = generateLiqPaySignature(PRIVATE_KEY, receivedData);
      if (calculatedSignature !== receivedSignature) {
        console.error(`liqpayCallback: Invalid signature. Expected: ${calculatedSignature}, Received: ${receivedSignature}.`);
        return res.status(400).send("Invalid signature");
      }
      console.log("liqpayCallback: Signature VERIFIED.");
      let paymentDetails;
      try {
        const jsonString = Buffer.from(receivedData, "base64").toString("utf-8");
        paymentDetails = JSON.parse(jsonString);
        console.log("liqpayCallback: Payment details decoded:", paymentDetails);
      } catch (error) {
        console.error("liqpayCallback: Error decoding data from LiqPay callback.", error);
        return res.status(400).send("Error decoding data");
      }
      const orderId = paymentDetails.order_id;
      if (!orderId || typeof orderId !== "string") {
        console.error("liqpayCallback: Invalid order_id in payment details:", paymentDetails);
        return res.status(400).send("Bad Request: Invalid order_id");
      }
      const status = paymentDetails.status;
      const paymentId = paymentDetails.payment_id || "N/A";
      console.log(`liqpayCallback: Updating Firestore for order_id=${orderId}, status=${status}, payment_id=${paymentId}`);
      const orderRef = db.collection("orders").doc(orderId);
      let newOrderStatus;
      let updatePayload = {
        liqpayPaymentId: paymentId,
        liqpayStatus: status,
        liqpayCallbackDataRaw: receivedData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      if (status === "success" || status === "sandbox") { newOrderStatus = "paid"; }
      else if (status === "failure" || status === "error" || status === "reversed") {
        newOrderStatus = "payment_failed";
        updatePayload.liqpayErrorDescription = paymentDetails.err_description || paymentDetails.err_code || "Unknown LiqPay error";
      } else { newOrderStatus = `payment_processing_${status}`; }
      updatePayload.status = newOrderStatus;
      const docSnap = await orderRef.get();
      if (docSnap.exists) {
        await orderRef.update(updatePayload);
        console.log(`liqpayCallback: Firestore updated for order ${orderId} with status ${newOrderStatus}.`);
      } else {
        console.warn(`liqpayCallback: Order ${orderId} not found. Creating record in 'liqpay_orphaned_callbacks'.`);
        await db.collection("liqpay_orphaned_callbacks").doc(orderId).set({ ...paymentDetails, processedSignature: calculatedSignature, receivedSignature: receivedSignature, receivedAt: admin.firestore.FieldValue.serverTimestamp(), note: "Order document not found at time of callback."});
      }
      return res.status(200).send("OK");
    } catch (error) {
      console.error("liqpayCallback: Unhandled error:", error);
      if (error instanceof Error) { console.error("Error stack:", error.stack); }
      return res.status(500).send("Internal Server Error");
    }
  }
);

export const prepareLiqPayPaymentData = onRequest(
  { cors: true, region: "europe-west1" },
  async (req, res) => {
    console.log("--- prepareLiqPayPaymentData Invoked (Manual Data/Signature - Checkpoint C) ---");
    if (req.method !== "POST") {
      console.warn("prepareLiqPayPaymentData: Received non-POST request.");
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    try {
      const { orderId, amount, description } = req.body;
      console.log("prepareLiqPayPaymentData: Request body:", req.body);

      if (!orderId || typeof amount === "undefined" || !description || typeof amount !== "number" || amount <= 0) {
        console.error("prepareLiqPayPaymentData: Invalid or missing parameters.", req.body);
        return res.status(400).json({ error: "Invalid or missing parameters." });
      }

      const PUBLIC_KEY = HARDCODED_PUBLIC_KEY;
      const PRIVATE_KEY = HARDCODED_PRIVATE_KEY;
      const SANDBOX_MODE = HARDCODED_SANDBOX_MODE;
      const RESULT_URL = HARDCODED_RESULT_URL;
      const SERVER_URL_CALLBACK = HARDCODED_SERVER_URL_CALLBACK;

      console.log("prepareLiqPayPaymentData: Using HARDCODED LiqPay params for data/signature generation.");

      const liqpayParams = {
        public_key: PUBLIC_KEY,
        action: "pay",
        amount: Number(amount),
        currency: "UAH",
        description: description,
        order_id: orderId,
        version: "3",
        sandbox: SANDBOX_MODE,
        result_url: RESULT_URL,
        server_url: SERVER_URL_CALLBACK,
        language: "uk",
      };
      console.log("prepareLiqPayPaymentData: Params for LiqPay (before base64):", liqpayParams);

      const jsonData = JSON.stringify(liqpayParams);
      const dataBase64 = Buffer.from(jsonData).toString("base64");
      console.log("prepareLiqPayPaymentData: Generated data (base64 - first 50):", dataBase64.substring(0, 50) + "...");

      const signatureBase64 = generateLiqPaySignature(PRIVATE_KEY, dataBase64);
      console.log("prepareLiqPayPaymentData: Generated signature (first 50):", signatureBase64.substring(0,50) + "...");

      return res.status(200).json({
        data: dataBase64,
        signature: signatureBase64,
      });

    } catch (error) {
      console.error("prepareLiqPayPaymentData: Unhandled error (Manual Data/Signature):", error);
      const msg = error instanceof Error ? error.message : "Unknown error.";
      if (error instanceof Error) { console.error("Stack:", error.stack); }
      return res.status(500).json({ error: "Internal error preparing payment data (manual).", details: msg });
    }
  }
);


export const getLiqPayOrderStatus = onRequest(
  { cors: true, region: "europe-west1" },
  async (req, res) => {
    console.log("getLiqPayOrderStatus: Invoked. Method:", req.method);
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    const orderId = req.query.orderId;
    if (!orderId) {
      return res.status(400).json({ error: "Missing orderId parameter." });
    }

    try {
      const PUBLIC_KEY = HARDCODED_PUBLIC_KEY;
      const PRIVATE_KEY = HARDCODED_PRIVATE_KEY;

      const paramsForStatus = {
        action: "status",
        version: "3",
        order_id: orderId,
        public_key: PUBLIC_KEY
      };

      const dataJson = JSON.stringify(paramsForStatus);
      const dataBase64 = Buffer.from(dataJson).toString("base64");
      const signature = generateLiqPaySignature(PRIVATE_KEY, dataBase64);

      const liqpayResponse = await fetch("https://www.liqpay.ua/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          data: dataBase64,
          signature: signature
        })
      });

      if (!liqpayResponse.ok) {
        throw new Error(`LiqPay API responded with status ${liqpayResponse.status}`);
      }

      const paymentStatus = await liqpayResponse.json();

      if (paymentStatus.result === "error" || paymentStatus.status === "error") {
        console.warn("LiqPay API returned an error status:", paymentStatus);
        return res.status(400).json({
          error: "LiqPay API returned an error.",
          details: paymentStatus.err_description || paymentStatus.err_code,
        });
      }

      console.log("Successfully fetched status:", paymentStatus);
      return res.status(200).json(paymentStatus);

    } catch (error) {
      console.error("getLiqPayOrderStatus unhandled error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error.";
      return res.status(500).json({ error: "Internal server error.", details: errorMessage });
    }
  }
);