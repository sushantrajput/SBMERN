
import { OrderDetails, WhatsAppResult } from "./types.ts";

export async function sendWhatsAppMessage(orderDetails: OrderDetails): Promise<WhatsAppResult> {
  // This is a mock implementation for a college project demo
  console.log("Simulating WhatsApp message for:", orderDetails.customerName);
  console.log("Phone number:", orderDetails.phoneNumber);
  console.log("Order ID:", orderDetails.orderId);
  
  // For a real implementation, you would integrate with WhatsApp Business API
  // But for a college project, we'll just simulate success
  return {
    success: true,
    data: {
      messageId: `whatsapp-msg-${Date.now()}`,
      status: "queued"
    }
  };
}
