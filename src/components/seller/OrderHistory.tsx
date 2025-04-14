
import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, FileDown, Filter } from "lucide-react";
import { products } from "@/data/products";
import { format } from "date-fns";

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  date: Date;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: {
    id: string;
    quantity: number;
  }[];
  paymentMethod: string;
}

const mockOrders: Order[] = [
  {
    id: "ORD001",
    customer: {
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com"
    },
    date: new Date(2025, 3, 8), // April 8, 2025
    status: "delivered",
    total: 12500,
    items: [
      { id: "1", quantity: 1 },
      { id: "4", quantity: 2 }
    ],
    paymentMethod: "Card"
  },
  {
    id: "ORD002",
    customer: {
      name: "Priya Patel",
      email: "priya.patel@example.com"
    },
    date: new Date(2025, 3, 9), // April 9, 2025
    status: "shipped",
    total: 6000,
    items: [
      { id: "2", quantity: 1 }
    ],
    paymentMethod: "UPI"
  },
  {
    id: "ORD003",
    customer: {
      name: "Amit Kumar",
      email: "amit.kumar@example.com"
    },
    date: new Date(2025, 3, 10), // April 10, 2025
    status: "processing",
    total: 2500,
    items: [
      { id: "5", quantity: 1 }
    ],
    paymentMethod: "Cash on Delivery"
  },
  {
    id: "ORD004",
    customer: {
      name: "Deepika Singh",
      email: "deepika.singh@example.com"
    },
    date: new Date(2025, 3, 10), // April 10, 2025
    status: "pending",
    total: 15000,
    items: [
      { id: "3", quantity: 1 },
      { id: "6", quantity: 1 }
    ],
    paymentMethod: "Net Banking"
  },
  {
    id: "ORD005",
    customer: {
      name: "Vikram Mehta",
      email: "vikram.mehta@example.com"
    },
    date: new Date(2025, 3, 7), // April 7, 2025
    status: "cancelled",
    total: 4500,
    items: [
      { id: "7", quantity: 1 }
    ],
    paymentMethod: "Wallet"
  }
];

const statusColors = {
  pending: "bg-yellow-500 hover:bg-yellow-600",
  processing: "bg-blue-500 hover:bg-blue-600",
  shipped: "bg-purple-500 hover:bg-purple-600",
  delivered: "bg-green-500 hover:bg-green-600",
  cancelled: "bg-red-500 hover:bg-red-600"
};

const OrderHistory: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const filteredOrders = statusFilter === "all" 
    ? mockOrders 
    : mockOrders.filter(order => order.status === statusFilter);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const getItemNames = (items: { id: string; quantity: number }[]) => {
    return items.map(item => {
      const product = products.find(p => p.id === item.id);
      return product ? `${product.name} (x${item.quantity})` : `Unknown Product (x${item.quantity})`;
    }).join(", ");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Order History</h2>
        <p className="text-muted-foreground">
          View and manage all customer orders.
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customer.name}</div>
                    <div className="text-xs text-gray-500">{order.customer.email}</div>
                  </div>
                </TableCell>
                <TableCell>{format(order.date, "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <span className="text-sm line-clamp-1" title={getItemNames(order.items)}>
                    {getItemNames(order.items)}
                  </span>
                </TableCell>
                <TableCell>{formatPrice(order.total)}</TableCell>
                <TableCell>
                  <Badge className={statusColors[order.status]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="shopez" size="sm" className="bg-shopez-600 hover:bg-shopez-700 text-white">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderHistory;
