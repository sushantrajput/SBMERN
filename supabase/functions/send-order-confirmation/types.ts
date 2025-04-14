
export interface OrderDetails {
  orderId: string;
  customerName: string;
  email: string;
  phoneNumber?: string;
  orderTotal: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface EmailResult {
  success: boolean;
  error?: unknown;
}

export interface WhatsAppResult {
  success: boolean;
  error?: unknown;
  data?: any;
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
