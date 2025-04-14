
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";
import OrderSummary from "@/components/ThankYou/OrderSummary";
import ActionButtons from "@/components/ThankYou/ActionButtons";

interface OrderDetails {
  orderId: string;
  whatsappNumber?: string;
  orderDate: string;
  whatsappStatus?: 'pending' | 'sent' | 'failed';
  email?: string;
  emailStatus?: 'sent' | 'failed' | 'pending';
}

const ThankYouPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendAttempted, setResendAttempted] = useState(false);
  
  // Retrieve order details from session storage
  useEffect(() => {
    const storedDetails = sessionStorage.getItem("orderDetails");
    if (storedDetails) {
      setOrderDetails(JSON.parse(storedDetails));
    } else {
      // If no order details, show notification
      toast({
        title: "No order found",
        description: "We couldn't find your order details.",
        variant: "destructive",
      });
    }
  }, []);
  
  // Redirect if accessed directly without checkout
  useEffect(() => {
    if (cartItems.length > 0 && !orderDetails) {
      navigate("/cart");
    }
  }, [cartItems.length, navigate, orderDetails]);

  const orderNumber = orderDetails?.orderId || Math.floor(10000000 + Math.random() * 90000000).toString();
  
  const handleResendConfirmation = async () => {
    if (!orderDetails || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Get order data from session storage
      const orderData = JSON.parse(sessionStorage.getItem("lastOrderData") || "{}");
      
      if (!orderData.customerName || !orderData.email) {
        toast({
          title: "Missing order information",
          description: "We couldn't find the complete order information needed to resend confirmation.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Call the Supabase function to resend the confirmation
      const response = await fetch("https://rfalvcczrbfuzoscwojb.functions.supabase.co/send-order-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      
      const result = await response.json();
      
      if (result.success && result.email.success) {
        toast({
          title: "Confirmation resent!",
          description: `A new confirmation email has been sent to ${orderData.email}`,
        });
        
        // Update order details with new status
        const updatedDetails: OrderDetails = {
          ...orderDetails,
          emailStatus: 'sent' as const,
        };
        
        setOrderDetails(updatedDetails);
        sessionStorage.setItem("orderDetails", JSON.stringify(updatedDetails));
      } else {
        toast({
          title: "Failed to resend confirmation",
          description: "There was an error sending the confirmation email. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error resending confirmation:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setResendAttempted(true);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="max-w-lg w-full text-center">
          <div className="mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-xl text-gray-600 mb-6">Your order has been placed successfully.</p>
          
          <OrderSummary 
            orderId={orderNumber}
            email={orderDetails?.email}
            emailStatus={orderDetails?.emailStatus}
            whatsappNumber={orderDetails?.whatsappNumber}
            whatsappStatus={orderDetails?.whatsappStatus}
            isLoading={isLoading}
            resendAttempted={resendAttempted}
            onResendConfirmation={handleResendConfirmation}
          />
          
          <ActionButtons />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYouPage;
