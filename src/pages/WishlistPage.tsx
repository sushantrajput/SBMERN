
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-shopez-800">My Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-medium text-gray-700 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Add items to your wishlist by clicking the heart icon on products</p>
            <Button asChild className="bg-shopez-accent hover:bg-shopez-500">
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-2">{item.name}</h3>
                  <p className="text-shopez-accent font-bold mb-4">
                    ₹{item.price.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAddToCart(item)} 
                      className="flex-1 bg-shopez-600"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> 
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;
