import crypto from "crypto";

const PAYMENTO_API_URL = process.env.PAYMENTO_API_URL || "https://api.paymento.io";
const PAYMENTO_GATEWAY_URL = process.env.PAYMENTO_GATEWAY_URL || "https://app.paymento.io/gateway";

export interface PaymentRequestParams {
  orderId: string;
  fiatAmount: string;
  fiatCurrency: string;
  returnUrl: string;
  speed?: number;
  additionalData?: Record<string, string>;
  email?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  body: string;
}

export interface PaymentCallback {
  Token: string;
  PaymentId: number;
  OrderId: string;
  OrderStatus: number;
  AdditionalData: Record<string, string>[];
}

export type PaymentOrderStatus =
  | "Initialize" // 0
  | "Pending" // 1
  | "PartialPaid" // 2
  | "WaitingToConfirm" // 3
  | "Timeout" // 4
  | "UserCanceled" // 5
  | "Paid" // 7
  | "Approve" // 8
  | "Reject"; // 9

export const PAYMENTO_STATUS: Record<number, PaymentOrderStatus> = {
  0: "Initialize",
  1: "Pending",
  2: "PartialPaid",
  3: "WaitingToConfirm",
  4: "Timeout",
  5: "UserCanceled",
  7: "Paid",
  8: "Approve",
  9: "Reject",
};

export function isPaidStatus(status: number): boolean {
  return status === 7 || status === 8;
}

export async function createPaymentRequest(params: PaymentRequestParams): Promise<string> {
  const apiKey = process.env.PAYMENTO_API_KEY;
  if (!apiKey) {
    throw new Error("Paymento API key not configured");
  }

  const payload = {
    orderId: params.orderId,
    fiatAmount: params.fiatAmount,
    fiatCurrency: params.fiatCurrency,
    returnUrl: params.returnUrl,
    speed: params.speed ?? 0,
    ...(params.additionalData && { additionalData: Object.entries(params.additionalData).map(([key, value]) => ({ key, value })) }),
    ...(params.email && { emailAddress: params.email }),
  };

  const response = await fetch(`${PAYMENTO_API_URL}/v1/payment/request`, {
    method: "POST",
    headers: {
      "Api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "text/plain",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Paymento API error: ${error}`);
  }

  const data: PaymentResponse = await response.json();
  
  if (!data.success || !data.body) {
    throw new Error(`Paymento error: ${data.message || "Unknown error"}`);
  }

  return data.body;
}

export function getPaymentUrl(token: string): string {
  return `${PAYMENTO_GATEWAY_URL}?token=${token}`;
}

export async function verifyPayment(token: string): Promise<PaymentCallback> {
  const apiKey = process.env.PAYMENTO_API_KEY;
  if (!apiKey) {
    throw new Error("Paymento API key not configured");
  }

  const response = await fetch(`${PAYMENTO_API_URL}/v1/payment/verify`, {
    method: "POST",
    headers: {
      "Api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Paymento verify error: ${error}`);
  }

  const data = await response.json();
  return data;
}

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secretKey = process.env.PAYMENTO_SECRET_KEY;
  if (!secretKey) {
    console.error("Paymento webhook secret not configured");
    return false;
  }

  const calculatedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(payload)
    .digest("hex")
    .toUpperCase();

  return calculatedSignature === signature.toUpperCase();
}