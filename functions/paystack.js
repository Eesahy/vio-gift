import crypto from "node:crypto";

const API = "https://api.paystack.co";

async function call(secretKey, method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.status !== true) {
    throw new Error(`Paystack ${method} ${path} failed (${res.status}): ${json.message || "no message"}`);
  }
  return json.data;
}

// Amounts are sent to Paystack in kobo (1 Naira = 100 kobo).
export const toKobo = (naira) => Math.round(naira * 100);

export function initializeTransaction(secretKey, { email, amountNaira, reference, callbackUrl, metadata }) {
  return call(secretKey, "POST", "/transaction/initialize", {
    email,
    amount: toKobo(amountNaira),
    currency: "NGN",
    reference,
    callback_url: callbackUrl,
    metadata,
    channels: ["card", "bank_transfer", "bank", "ussd"],
  });
}

export function verifyTransaction(secretKey, reference) {
  return call(secretKey, "GET", `/transaction/verify/${encodeURIComponent(reference)}`);
}

// Paystack signs each webhook body with HMAC-SHA512 using your secret key.
export function isValidSignature(secretKey, rawBody, signature) {
  if (!signature || !rawBody) return false;
  const expected = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const CHANNEL_LABELS = { card: "Card", bank_transfer: "Bank Transfer", bank: "Bank", ussd: "USSD" };
export const channelLabel = (channel) => CHANNEL_LABELS[channel] || "Paystack";
