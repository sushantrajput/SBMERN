
import { OrderDetails, EmailResult } from "./types.ts";

export async function sendEmailJS(orderDetails: OrderDetails): Promise<EmailResult> {
  try {
    // Use environment variables if available, otherwise fallback to hardcoded values
    const emailJSServiceId = Deno.env.get("EMAILJS_SERVICE_ID") || "service_vv6bplu";
    const emailJSTemplateId = Deno.env.get("EMAILJS_TEMPLATE_ID") || "template_0yjyqtn";
    const emailJSUserId = Deno.env.get("EMAILJS_USER_ID") || "RKiG8leYhv5Owxdlg";
    
    console.log("Attempting to send email with EmailJS");
    console.log(`Service ID: ${emailJSServiceId}`);
    console.log(`Template ID: ${emailJSTemplateId}`);
    console.log(`User ID: ${emailJSUserId}`);
    console.log(`Sending to email: ${orderDetails.email}`);

    // Format order items for better email presentation
    const formattedItems = orderDetails.items.map(item => 
      `${item.name} x ${item.quantity} - ${new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR',
        maximumFractionDigits: 0 
      }).format(item.price * item.quantity)}`
    ).join('\n');

    const templateParams = {
      to_name: orderDetails.customerName,
      to_email: orderDetails.email,
      order_id: orderDetails.orderId,
      order_total: new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR',
        maximumFractionDigits: 0 
      }).format(orderDetails.orderTotal),
      items: formattedItems,
    };

    console.log("Sending email with params:", JSON.stringify(templateParams, null, 2));

    const response = await fetch(
      `https://api.emailjs.com/api/v1.0/email/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: emailJSServiceId,
          template_id: emailJSTemplateId,
          user_id: emailJSUserId,
          template_params: templateParams,
        }),
      }
    );

    const responseText = await response.text();
    console.log(`EmailJS API response status: ${response.status}`);
    console.log(`EmailJS API response body: ${responseText}`);

    if (response.status === 200) {
      return { success: true };
    } else {
      console.error("EmailJS API error:", responseText);
      return { success: false, error: responseText };
    }
  } catch (error) {
    console.error("Error sending email via EmailJS:", error);
    return { success: false, error: error.message || String(error) };
  }
}
