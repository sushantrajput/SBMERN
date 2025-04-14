
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, OrderDetails } from "./types.ts";
import { validateOrderDetails } from "./validation.ts";
import { sendEmailJS } from "./email-service.ts";
import { sendWhatsAppMessage } from "./whatsapp-service.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  
  try {
    if (req.method === "POST") {
      const requestBody = await req.text();
      console.log("Received request body:", requestBody);
      
      let orderDetails: OrderDetails;
      try {
        orderDetails = JSON.parse(requestBody);
      } catch (e) {
        console.error("Failed to parse request body:", e);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid JSON in request body",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }
      
      console.log("Parsed order details:", JSON.stringify(orderDetails));
      
      // Validate the required fields
      const validation = validateOrderDetails(orderDetails);
      if (!validation.valid) {
        return new Response(
          JSON.stringify({
            success: false,
            error: validation.error,
            receivedData: orderDetails,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }
      
      // Send email confirmation
      console.log("Sending email confirmation...");
      const emailResult = await sendEmailJS(orderDetails);
      console.log("Email result:", JSON.stringify(emailResult));
      
      // Send WhatsApp notification if phone number is provided
      let whatsappResult = { success: false, error: "WhatsApp notification not requested" };
      if (orderDetails.phoneNumber) {
        console.log("Sending WhatsApp notification...");
        whatsappResult = await sendWhatsAppMessage(orderDetails);
        console.log("WhatsApp result:", JSON.stringify(whatsappResult));
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          email: emailResult,
          whatsapp: whatsappResult,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Method not allowed",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
