
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoryGrid from "@/components/CategoryGrid";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Get featured products for the homepage
  const featuredProducts = products.filter(product => product.featured === true);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full bg-gradient-to-r from-shopez-50 to-shopez-100 py-3 shadow-sm">
        <div className="container mx-auto flex justify-center">
          <Link to="/seller">
            <Button 
              variant="shopez" 
              className="shadow-md flex items-center gap-2 px-6 py-2 font-medium"
            >
              <Store className="h-4 w-4" />
              Access Seller Dashboard
            </Button>
          </Link>
        </div>
      </div>
      <Hero />
      <FeaturedProducts 
        products={featuredProducts} 
        title="Featured Products"
        viewAllLink="/products" 
      />
      <CategoryGrid />
      <Footer />
    </div>
  );
};

export default Index;
