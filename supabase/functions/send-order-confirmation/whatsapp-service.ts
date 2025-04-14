
import { OrderDetails, WhatsAppResult } from "./types.ts";

export async function sendWhatsAppMessage(orderDetails: OrderDetails): Promise<WhatsAppResult> {

  console.log("Simulating WhatsApp message for:", orderDetails.customerName);
  console.log("Phone number:", orderDetails.phoneNumber);
  console.log("Order ID:", orderDetails.orderId);
  
  return {
    success: true,
    data: {
      messageId: `whatsapp-msg-${Date.now()}`,
      status: "queued"
    }
  };
}
