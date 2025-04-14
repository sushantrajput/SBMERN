
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, Heart, User, LogIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const { getCartItemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setUserName(userData.name || "User");
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-shopez-800">
                Shop<span className="text-shopez-accent">EZ</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-shopez-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-shopez-600 transition-colors">
              Products
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-shopez-600 transition-colors">
              Categories
            </Link>
            <Link to="/deals" className="text-gray-700 hover:text-shopez-600 transition-colors">
              Deals
            </Link>
          </nav>

          {/* Search, Cart, and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-shopez-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative hidden sm:block">
              <Heart className="h-6 w-6 text-gray-700" />
              {wishlistItems.length > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {wishlistItems.length}
                </Badge>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {getCartItemCount() > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {getCartItemCount()}
                </Badge>
              )}
            </Link>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="hidden md:flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-700 flex items-center gap-1"
                  onClick={handleLogout}
                >
                  <User className="h-4 w-4" />
                  {userName.split(" ")[0]}
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link to="/auth">
                    <LogIn className="mr-1 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              </div>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 animate-fade-in">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-shopez-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-shopez-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-shopez-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/categories" 
              className="text-gray-700 hover:text-shopez-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              to="/deals" 
              className="text-gray-700 hover:text-shopez-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Deals
            </Link>
            <Link 
              to="/wishlist" 
              className="text-gray-700 hover:text-shopez-600 transition-colors py-2 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="h-5 w-5" />
              Wishlist
              {wishlistItems.length > 0 && (
                <Badge>{wishlistItems.length}</Badge>
              )}
            </Link>
            
            {isLoggedIn ? (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <div className="text-gray-700 py-2">
                  <span className="font-medium">Hi, {userName}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <Link 
                  to="/auth" 
                  className="text-gray-700 hover:text-shopez-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button 
                    variant="shopez" 
                    className="w-full"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login / Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
