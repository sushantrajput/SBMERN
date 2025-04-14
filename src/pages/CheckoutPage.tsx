import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [usePhoneForWhatsapp, setUsePhoneForWhatsapp] = useState(true);
  const [shippingMethod, setShippingMethod] = useState("standard");
  
  const [productEmails, setProductEmails] = useState<Record<string, string>>({});
  
  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(getCartTotal());

  const handleEmailChange = (productId: string, emailValue: string) => {
    setProductEmails(prevEmails => ({
      ...prevEmails,
      [productId]: emailValue
    }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const orderId = Math.floor(10000000 + Math.random() * 90000000).toString();
    const orderDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    try {
      const orderItems = cartItems.map(item => {
        const { product, quantity } = item;
        const itemPrice = product.discount
          ? product.price * (1 - product.discount / 100)
          : product.price;
          
        return {
          id: product.id,
          name: product.name,
          quantity: quantity,
          price: itemPrice
        };
      });
      
      const subtotal = getCartTotal();
      const tax = subtotal * 0.08;
      const total = subtotal + tax;
      
      const activeWhatsappNumber = usePhoneForWhatsapp ? phone : whatsappNumber;

      const orderData = {
        orderId,
        customerName: `${firstName} ${lastName}`,
        email: email,
        phoneNumber: activeWhatsappNumber,
        orderTotal: total,
        items: orderItems
      };

      sessionStorage.setItem('lastOrderData', JSON.stringify(orderData));

      sessionStorage.setItem('orderDetails', JSON.stringify({
        orderId,
        whatsappNumber: activeWhatsappNumber,
        email: email,
        orderDate,
        whatsappStatus: 'pending',
        emailStatus: 'pending'
      }));
      
      console.log("Sending order confirmation to:", email);
      try {
        const primaryEmailResponse = await fetch("https://rfalvcczrbfuzoscwojb.functions.supabase.co/send-order-confirmation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(orderData)
        });

        const responseData = await primaryEmailResponse.json();
        console.log("Primary email response:", responseData);
        
        const currentOrderDetails = JSON.parse(sessionStorage.getItem('orderDetails') || '{}');
        sessionStorage.setItem('orderDetails', JSON.stringify({
          ...currentOrderDetails,
          emailStatus: responseData.email?.success ? 'sent' : 'failed'
        }));
        
        if (responseData.whatsapp) {
          const whatsappStatus = responseData.whatsapp.success ? 'sent' : 'failed';
          sessionStorage.setItem('orderDetails', JSON.stringify({
            ...JSON.parse(sessionStorage.getItem('orderDetails') || '{}'),
            whatsappStatus
          }));
        }
      } catch (error) {
        console.error("Error sending primary email:", error);
        const currentOrderDetails = JSON.parse(sessionStorage.getItem('orderDetails') || '{}');
        sessionStorage.setItem('orderDetails', JSON.stringify({
          ...currentOrderDetails,
          emailStatus: 'failed'
        }));
      }
      
      const successfulEmails = [email];
      const failedEmails = [];
      
      for (const [productId, productEmail] of Object.entries(productEmails)) {
        if (!productEmail || productEmail.trim() === "" || productEmail === email) {
          continue;
        }
        
        const productItem = cartItems.find(item => item.product.id === productId);
        if (!productItem) continue;
        
        const { product, quantity } = productItem;
        const itemPrice = product.discount
          ? product.price * (1 - product.discount / 100)
          : product.price;
          
        try {
          const productSpecificData = {
            orderId: `${orderId}-${product.id}`,
            customerName: `${firstName} ${lastName}`,
            email: productEmail,
            orderTotal: itemPrice * quantity,
            items: [{
              name: product.name,
              quantity: quantity,
              price: itemPrice
            }]
          };

          const productEmailResponse = await fetch("https://rfalvcczrbfuzoscwojb.functions.supabase.co/send-order-confirmation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(productSpecificData)
          });
          
          const responseData = await productEmailResponse.json();
          console.log(`Product email response for ${productId} to ${productEmail}:`, responseData);
          
          if (responseData.email?.success) {
            successfulEmails.push(productEmail);
          } else {
            failedEmails.push(productEmail);
          }
        } catch (error) {
          console.error(`Failed to send product email for ${productId} to ${productEmail}:`, error);
          failedEmails.push(productEmail);
        }
      }
      
      if (failedEmails.length > 0) {
        console.error("Some product-specific emails failed:", failedEmails);
        toast({
          title: "Order placed with some notification issues",
          description: `We couldn't send confirmation to all email addresses. ${successfulEmails.length} succeeded, ${failedEmails.length} failed.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Order placed successfully!",
          description: `Order confirmation sent to ${successfulEmails.length} email${successfulEmails.length > 1 ? 's' : ''}` + 
                      (activeWhatsappNumber ? " and WhatsApp notification is on its way." : "."),
        });
      }
      
      clearCart();
      navigate("/thank-you");
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <form onSubmit={handleCheckout}>
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required 
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required 
                        className="mt-1" 
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="email">Primary Email Address (for order confirmation)</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      className="mt-1" 
                    />
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="address">Street Address</Label>
                    <Input 
                      id="address" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required 
                      className="mt-1" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required 
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state" 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required 
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">Zip Code</Label>
                      <Input 
                        id="zip" 
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        required 
                        className="mt-1" 
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                      className="mt-1" 
                    />
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="usePhoneForWhatsapp" 
                        checked={usePhoneForWhatsapp} 
                        onCheckedChange={(checked) => setUsePhoneForWhatsapp(checked === true)}
                      />
                      <Label htmlFor="usePhoneForWhatsapp">Use phone number for WhatsApp notifications</Label>
                    </div>
                  </div>
                  
                  {!usePhoneForWhatsapp && (
                    <div className="mt-4">
                      <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                      <Input 
                        id="whatsappNumber" 
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="Enter your WhatsApp number" 
                        className="mt-1" 
                      />
                    </div>
                  )}
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Product-specific Email Notifications</h2>
                  <p className="text-sm text-gray-500 mb-4">Optionally send product confirmation to different email addresses</p>
                  
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={`email-${item.product.id}`} className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <Label htmlFor={`email-${item.product.id}`} className="text-sm">
                            {item.product.name} (optional)
                          </Label>
                          <Input
                            id={`email-${item.product.id}`}
                            type="email"
                            placeholder="Email for this product (optional)"
                            value={productEmails[item.product.id] || ''}
                            onChange={(e) => handleEmailChange(item.product.id, e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  
                  <Tabs defaultValue="credit-card">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="credit-card">Credit Card</TabsTrigger>
                      <TabsTrigger value="paypal">PayPal</TabsTrigger>
                      <TabsTrigger value="other">Other</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="credit-card">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input id="cardName" required className="mt-1" />
                        </div>
                        
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" required className="mt-1" placeholder="1234 5678 9012 3456" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiration Date</Label>
                            <Input id="expiry" required className="mt-1" placeholder="MM/YY" />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" required className="mt-1" placeholder="123" />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="paypal">
                      <div className="flex items-center justify-center p-8">
                        <div className="text-center">
                          <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-16 mx-auto mb-4" />
                          <p className="text-gray-600">You will be redirected to PayPal to complete the payment.</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="other">
                      <div className="p-4">
                        <RadioGroup defaultValue="bank-transfer">
                          <div className="flex items-center space-x-2 mb-4">
                            <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                            <Label htmlFor="bank-transfer">Bank Transfer</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" />
                            <Label htmlFor="cash-on-delivery">Cash on Delivery</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                  
                  <RadioGroup defaultValue="standard" value={shippingMethod} onValueChange={setShippingMethod}>
                    <div className="flex items-start space-x-2 mb-4 p-3 border border-gray-200 rounded-md">
                      <RadioGroupItem value="standard" id="standard" className="mt-1" />
                      <div>
                        <Label htmlFor="standard" className="font-medium text-base">Standard Shipping</Label>
                        <p className="text-gray-600 text-sm mt-1">Delivery in 3-5 business days</p>
                        <p className="text-shopez-accent mt-1">Free</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2 mb-4 p-3 border border-gray-200 rounded-md">
                      <RadioGroupItem value="express" id="express" className="mt-1" />
                      <div>
                        <Label htmlFor="express" className="font-medium text-base">Express Shipping</Label>
                        <p className="text-gray-600 text-sm mt-1">Delivery in 1-2 business days</p>
                        <p className="font-medium mt-1">₹999</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2 p-3 border border-gray-200 rounded-md">
                      <RadioGroupItem value="overnight" id="overnight" className="mt-1" />
                      <div>
                        <Label htmlFor="overnight" className="font-medium text-base">Overnight Shipping</Label>
                        <p className="text-gray-600 text-sm mt-1">Next business day delivery</p>
                        <p className="font-medium mt-1">₹1999</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </form>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-4">
                  {cartItems.map((item) => {
                    const { product, quantity } = item;
                    const itemPrice = product.discount
                      ? product.price * (1 - product.discount / 100)
                      : product.price;
                    return (
                      <div key={product.id} className="flex justify-between">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-md overflow-hidden mr-3 bg-gray-100">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-gray-800">
                            {product.name} <span className="text-gray-500">x{quantity}</span>
                          </span>
                        </div>
                        <span className="font-medium">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(itemPrice * quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{formattedTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (estimated):</span>
                    <span>
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(getCartTotal() * 0.08)}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(getCartTotal() * 1.08)}
                    </span>
                  </div>
                </div>
                
                <Button
                  className="w-full mt-6 bg-shopez-accent hover:bg-shopez-500"
                  onClick={handleCheckout}
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Processing..." : "Complete Order"}
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our <a href="#" className="text-shopez-600 hover:underline">Terms of Service</a> and <a href="#" className="text-shopez-600 hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
