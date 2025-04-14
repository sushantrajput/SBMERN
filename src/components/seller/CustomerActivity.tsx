
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  created_at: string;
  orders: {
    count: number;
    total: number;
  };
  last_order_date: string | null;
}

const CustomerActivity: React.FC = () => {
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      // Fetch customers with their order counts and totals
      const { data: customersData, error } = await supabase
        .from('customers')
        .select(`
          *,
          orders: orders (
            count,
            total_amount
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return customersData.map((customer: any) => ({
        ...customer,
        orders: {
          count: customer.orders?.length || 0,
          total: customer.orders?.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) || 0
        },
        last_order_date: customer.orders?.length > 0 
          ? customer.orders[0].created_at 
          : null
      }));
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTimeAgo = (date: string | null) => {
    if (!date) return 'Never';
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg border shadow-sm">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  const totalCustomers = customers?.length || 0;
  const activeCustomers = customers?.filter(c => c.orders.count > 0).length || 0;
  const averageSpend = customers?.reduce((acc, c) => acc + c.orders.total, 0) / (totalCustomers || 1) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Customer Activity</h2>
        <p className="text-muted-foreground">
          Monitor your customers' activities and purchasing behavior.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Customers</h3>
          <p className="text-3xl font-bold">{totalCustomers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Customers</h3>
          <p className="text-3xl font-bold">{activeCustomers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Average Spend</h3>
          <p className="text-3xl font-bold">{formatPrice(averageSpend)}</p>
        </div>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers?.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`} alt={customer.name} />
                      <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-gray-500">{customer.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={customer.orders.count > 0 ? 'default' : 'secondary'}
                    className={customer.orders.count > 0 ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    {customer.orders.count > 0 ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>{customer.orders.count}</TableCell>
                <TableCell>{formatPrice(customer.orders.total)}</TableCell>
                <TableCell>{getTimeAgo(customer.last_order_date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomerActivity;
