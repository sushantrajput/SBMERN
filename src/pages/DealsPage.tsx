
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Percent } from "lucide-react";

const DealsPage = () => {
  // Filter products that have a discount
  const discountedProducts = products.filter(product => product.discount);

  // Sort by discount percentage (highest first)
  const sortedDeals = [...discountedProducts].sort((a, b) => 
    (b.discount || 0) - (a.discount || 0)
  );

  // Create some special deals that aren't tied to specific products
  const specialDeals = [
    {
      id: 'deal1',
      title: 'Free Shipping',
      code: 'FREESHIP50',
      description: 'Free shipping on orders over ₹3,500',
      expiryDate: '2025-05-10',
      minOrder: 3500
    },
    {
      id: 'deal2',
      title: 'Bundle Discount',
      code: 'BUNDLE15',
      description: 'Save 15% when you buy 3 or more accessories',
      expiryDate: '2025-05-15',
      minOrder: 0
    },
    {
      id: 'deal3',
      title: 'New Customer',
      code: 'WELCOME10',
      description: '10% off your first order',
      expiryDate: '2025-06-01',
      minOrder: 0
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Special Deals</h1>
            <p className="text-gray-600">
              Discover our best offers and save on your favorite products.
            </p>
          </div>
        </div>

        {/* Coupon Codes Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-bold mb-6">Coupon Codes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialDeals.map((deal) => (
              <div 
                key={deal.id} 
                className="border border-dashed border-gray-300 rounded-lg p-6 bg-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{deal.title}</h3>
                  <Badge variant="outline" className="text-shopez-600 border-shopez-600">
                    <Percent className="h-3 w-3 mr-1" /> Special Offer
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">{deal.description}</p>
                <div className="bg-gray-100 p-3 rounded-md text-center mb-4">
                  <span className="font-mono font-bold text-lg text-gray-900">{deal.code}</span>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Valid until {new Date(deal.expiryDate).toLocaleDateString()}</span>
                  {deal.minOrder > 0 && <span>Min. order: ₹{deal.minOrder.toLocaleString()}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Discounted Products Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50">
          <h2 className="text-2xl font-bold mb-6">Products on Sale</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {sortedDeals.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-600">No products currently on sale. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DealsPage;
