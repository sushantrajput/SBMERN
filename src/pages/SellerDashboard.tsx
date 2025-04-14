
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Package, Users, Clock, FileText } from "lucide-react";
import ProductManagement from "@/components/seller/ProductManagement";
import CustomerActivity from "@/components/seller/CustomerActivity";
import OrderHistory from "@/components/seller/OrderHistory";
import OrderDetails from "@/components/seller/OrderDetails";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = React.useState("products");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex">
        <SidebarProvider defaultOpen={true}>
          <Sidebar>
            <SidebarHeader>
              <div className="px-3 py-2">
                <h2 className="text-lg font-semibold text-shopez-600">Seller Dashboard</h2>
                <p className="text-xs text-gray-500">Manage your shop efficiently</p>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("products")}
                    isActive={activeTab === "products"}
                    tooltip="Product Management"
                  >
                    <Package className="mr-2" />
                    <span>Products</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("customers")}
                    isActive={activeTab === "customers"}
                    tooltip="Customer Activity"
                  >
                    <Users className="mr-2" />
                    <span>Customers</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("orders")}
                    isActive={activeTab === "orders"}
                    tooltip="Order History"
                  >
                    <Clock className="mr-2" />
                    <span>Orders</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("details")}
                    isActive={activeTab === "details"}
                    tooltip="Order Details"
                  >
                    <FileText className="mr-2" />
                    <span>Details</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 p-6">
            <div className="container mx-auto">
              {activeTab === "products" && <ProductManagement />}
              {activeTab === "customers" && <CustomerActivity />}
              {activeTab === "orders" && <OrderHistory />}
              {activeTab === "details" && <OrderDetails />}
            </div>
          </main>
        </SidebarProvider>
      </div>
      
      <Footer />
    </div>
  );
};

export default SellerDashboard;
