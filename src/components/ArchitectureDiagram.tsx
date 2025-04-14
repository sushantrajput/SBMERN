
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ArchitectureDiagram = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold text-center mb-8">ShopEZ Architecture & Features</h2>
      
      <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
        {/* Frontend Section */}
        <div className="border-2 border-shopez-800 rounded-lg p-6 bg-white shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-shopez-800 border-b pb-2">Frontend</h3>
          <p className="text-sm text-gray-600 mb-4">
            User interface components that handle presentation and user interactions
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['User Authentication', 'Products', 'Cart', 'Profile', 'Checkout', 'Admin Dashboard'].map((item) => (
              <div key={item} className="bg-shopez-100 rounded p-3 text-center text-sm border border-shopez-300">
                {item}
              </div>
            ))}
          </div>
        </div>
        
        {/* Architecture Flow */}
        <div className="flex justify-center">
          <div className="w-0.5 h-16 bg-gray-400"></div>
        </div>
        
        {/* API Layer */}
        <div className="border-2 border-blue-700 rounded-lg p-6 bg-white shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-blue-700 border-b pb-2">Backend (API Layer)</h3>
          <p className="text-sm text-gray-600 mb-4">
            API endpoints that handle business logic and data processing
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Users API', 'Products API', 'Orders API', 'Cart API', 'Admin Authentication', 'Payment Gateway'].map((item) => (
              <div key={item} className="bg-blue-100 rounded p-3 text-center text-sm border border-blue-300">
                {item}
              </div>
            ))}
          </div>
        </div>
        
        {/* Architecture Flow */}
        <div className="flex justify-center">
          <div className="w-0.5 h-16 bg-gray-400"></div>
        </div>
        
        {/* Database Layer */}
        <div className="border-2 border-green-700 rounded-lg p-6 bg-white shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-green-700 border-b pb-2">Database</h3>
          <p className="text-sm text-gray-600 mb-4">
            Collections that store all application data in structured format
          </p>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            {['Users Collection', 'Products Collection', 'Orders Collection', 'Cart Collection'].map((item) => (
              <div key={item} className="bg-green-100 rounded p-3 text-center text-sm border border-green-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Key Features Section */}
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Product Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Browse an extensive catalog with detailed descriptions, customer reviews, pricing, and available discounts to find the perfect items.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shop Now Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Each product features a convenient "Shop Now" button to initiate the purchasing process instantly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Details Page</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Provide shipping address, payment method, and specific product requirements on our streamlined order details page.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secure Checkout Process</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your personal information is handled with the utmost security, making the purchasing process swift and trouble-free.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Confirmation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Receive confirmation notifications and review all details about your order, including shipping and payment information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seller Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sellers can manage product listings, view order history, monitor customer activity, and access detailed sales analytics.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-600">
        <p className="text-base">Data flows between these three layers to provide a complete e-commerce experience:</p>
        <ul className="mt-3 max-w-2xl mx-auto text-sm list-disc list-inside text-left space-y-2">
          <li>The <strong>Frontend</strong> handles user interactions and display, with components for authentication, product browsing, cart management, and admin controls.</li>
          <li>The <strong>Backend</strong> provides API endpoints that process requests, implement business logic, and manage authentication and payment processing.</li>
          <li>The <strong>Database</strong> stores all application data in collections for users, products, orders, and cart items.</li>
        </ul>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
