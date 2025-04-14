
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { products } from "@/data/products";
import { FileText, Printer, Send } from "lucide-react";

// Mock data for a detailed order
const orderDetail = {
  id: "ORD001",
  customer: {
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    address: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400001",
      country: "India"
    }
  },
  date: new Date(2025, 3, 8), // April 8, 2025
  status: "delivered",
  trackingNumber: "IND123456789",
  items: [
    { id: "1", quantity: 1, price: 5000 },
    { id: "4", quantity: 2, price: 3750 }
  ],
  payment: {
    method: "Credit Card",
    transactionId: "TXN987654321",
    subtotal: 12500,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 12500
  },
  notes: "Please leave the package at the front door if I'm not available.",
  history: [
    { status: "created", date: new Date(2025, 3, 8, 10, 15), message: "Order placed" },
    { status: "processing", date: new Date(2025, 3, 8, 11, 30), message: "Payment confirmed" },
    { status: "shipped", date: new Date(2025, 3, 9, 9, 45), message: "Order shipped" },
    { status: "delivered", date: new Date(2025, 3, 10, 14, 20), message: "Order delivered" }
  ]
};

const statusColors = {
  created: "bg-gray-500",
  pending: "bg-yellow-500",
  processing: "bg-blue-500",
  shipped: "bg-purple-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500"
};

const OrderDetails: React.FC = () => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const getProductDetails = (id: string) => {
    return products.find(product => product.id === id) || {
      name: "Unknown Product",
      image: "/placeholder.svg"
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Order Details</h2>
          <p className="text-muted-foreground">Detailed information about order #{orderDetail.id}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Send className="mr-2 h-4 w-4" />
            Send Invoice
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
            <CardDescription>
              Order #{orderDetail.id} • Placed on {format(orderDetail.date, "MMMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderDetail.items.map((item) => {
                      const product = getProductDetails(item.id);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="h-10 w-10 rounded-md object-cover" 
                              />
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatPrice(item.price)}</TableCell>
                          <TableCell className="text-right">
                            {formatPrice(item.price * item.quantity)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              <Separator />
              
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(orderDetail.payment.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{orderDetail.payment.shipping === 0 ? 'Free' : formatPrice(orderDetail.payment.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(orderDetail.payment.tax)}</span>
                </div>
                {orderDetail.payment.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600">-{formatPrice(orderDetail.payment.discount)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(orderDetail.payment.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Customer Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Details</h3>
                <p className="font-medium">{orderDetail.customer.name}</p>
                <p className="text-sm">{orderDetail.customer.email}</p>
                <p className="text-sm">{orderDetail.customer.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Shipping Address</h3>
                <p className="text-sm">{orderDetail.customer.address.street}</p>
                <p className="text-sm">
                  {orderDetail.customer.address.city}, {orderDetail.customer.address.state} {orderDetail.customer.address.zip}
                </p>
                <p className="text-sm">{orderDetail.customer.address.country}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h3>
                <p className="font-medium">{orderDetail.payment.method}</p>
                <p className="text-sm">Transaction ID: {orderDetail.payment.transactionId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Shipping Method</h3>
                <p className="text-sm">Standard Shipping</p>
                <p className="text-sm">Tracking #: {orderDetail.trackingNumber}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-4">
            {orderDetail.history.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-3 w-3 rounded-full ${statusColors[event.status]}`} />
                  {index < orderDetail.history.length - 1 && (
                    <div className="h-full w-px bg-border flex-grow mt-1" />
                  )}
                </div>
                <div className="space-y-1 pb-4">
                  <p className="text-sm font-medium">
                    {event.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(event.date, "MMM d, yyyy")} at {format(event.date, "h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            View Complete Order History
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderDetails;
