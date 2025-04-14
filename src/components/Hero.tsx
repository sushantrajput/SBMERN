
import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-shopez-800 to-shopez-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082352121-fa243f3dde7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] opacity-20 bg-cover bg-center"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 py-16 md:py-24 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Shop<span className="text-shopez-accent">EZ</span>: <br />
              Shop with Ease
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-lg">
              Your one-stop destination for effortless online shopping. Find the perfect items with our comprehensive product catalog.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Button
                className="bg-shopez-accent hover:bg-shopez-500 text-white px-6 py-2 rounded-md transition-colors text-lg"
                asChild
              >
                <Link to="/products">
                  Shop Now
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-6 py-2 rounded-md transition-colors text-lg"
                asChild
              >
                <Link to="/deals">
                  View Deals
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">New Arrival</span>
                    <span className="text-shopez-accent font-semibold">30% OFF</span>
                  </div>
                  
                  <div className="relative h-64 md:h-72 overflow-hidden rounded-md">
                    <img 
                      src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z29sZCUyMGJhbmdsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60" 
                      alt="Featured Product" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold">Elegant Gold Bangle</h3>
                    <p className="text-sm text-gray-300 mt-1">Perfect for special occasions or everyday wear</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold">$89.99</span>
                        <span className="text-sm line-through text-gray-400 ml-2">$129.99</span>
                      </div>
                      
                      <Link 
                        to="/product/1" 
                        className="flex items-center text-shopez-accent hover:text-shopez-300 transition-colors text-sm"
                      >
                        <span>View details</span>
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
