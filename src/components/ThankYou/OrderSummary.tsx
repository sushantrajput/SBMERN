
import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  orderId: string;
  email?: string;
  emailStatus?: 'sent' | 'failed' | 'pending';
  whatsappNumber?: string;
  whatsappStatus?: 'pending' | 'sent' | 'failed';
  isLoading: boolean;
  resendAttempted: boolean;
  onResendConfirmation: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderId,
  email,
  emailStatus,
  whatsappNumber,
  whatsappStatus,
  isLoading,
  resendAttempted,
  onResendConfirmation
}) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm max-w-lg w-full text-center">
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <p className="text-gray-600">Order Number:</p>
        <p className="text-xl font-medium text-shopez-800"># {orderId}</p>
      </div>
      
      <p className="text-gray-600 mb-4">
        We've sent a confirmation email to your inbox with all the details of your order.
        You will receive another email when your order ships.
      </p>
      
      {email && getEmailStatus(email, emailStatus, isLoading, resendAttempted, onResendConfirmation)}
      {whatsappNumber && getWhatsAppStatus(whatsappNumber, whatsappStatus)}
    </div>
  );
};

const getWhatsAppStatus = (whatsappNumber: string, whatsappStatus?: 'pending' | 'sent' | 'failed') => {
  switch (whatsappStatus) {
    case 'sent':
      return (
        <div className="flex items-center justify-center gap-2 mb-8 text-gray-600 bg-green-50 p-3 rounded-md">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <p>WhatsApp notification sent to: {whatsappNumber}</p>
        </div>
      );
    case 'failed':
      return (
        <div className="flex items-center justify-center gap-2 mb-8 text-gray-600 bg-red-50 p-3 rounded-md">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <p>WhatsApp notification could not be sent to: {whatsappNumber}</p>
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center gap-2 mb-8 text-gray-600 bg-gray-50 p-3 rounded-md">
          <p>WhatsApp notification will be sent to: {whatsappNumber}</p>
        </div>
      );
  }
};

const getEmailStatus = (
  email: string, 
  emailStatus?: 'sent' | 'failed' | 'pending',
  isLoading?: boolean,
  resendAttempted?: boolean,
  onResendConfirmation?: () => void
) => {
  if (emailStatus === 'failed' || resendAttempted) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 mb-8 text-gray-600 bg-red-50 p-4 rounded-md">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <p>Order confirmation email could not be sent to: {email}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2" 
          onClick={onResendConfirmation}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Resend Confirmation"}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center gap-2 mb-4 text-gray-600 bg-green-50 p-3 rounded-md">
      <CheckCircle2 className="h-5 w-5 text-green-500" />
      <p>Order confirmation email sent to: {email}</p>
    </div>
  );
};

export default OrderSummary;
