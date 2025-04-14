
import { OrderDetails } from "./types.ts";

export function validateOrderDetails(orderDetails: OrderDetails): { valid: boolean, error?: string } {
  if (!orderDetails.orderId || !orderDetails.customerName || !orderDetails.email) {
    console.error("Missing required fields in order details");
    return { 
      valid: false, 
      error: "Missing required order details" 
    };
  }
  
  if (!orderDetails.items || !Array.isArray(orderDetails.items) || orderDetails.items.length === 0) {
    console.error("Missing or invalid items in order details");
    return { 
      valid: false, 
      error: "Order must contain at least one item" 
    };
  }
  
  return { valid: true };
}
