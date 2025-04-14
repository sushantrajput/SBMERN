
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(getCartTotal());

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <div className="mb-6">
              <ShoppingCart className="h-20 w-20 text-gray-400 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button asChild className="bg-shopez-accent hover:bg-shopez-500">
              <Link to="/products">
                Start Shopping
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                {cartItems.map((item) => {
                  const { product, quantity } = item;
                  const itemPrice = product.discount
                    ? product.price * (1 - product.discount / 100)
                    : product.price;
                  const totalItemPrice = itemPrice * quantity;
                  
                  return (
                    <div key={product.id} className="flex flex-col sm:flex-row border-b pb-6 last:border-b-0 last:pb-0">
                      <div className="sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="sm:ml-6 flex flex-col flex-grow">
                        <div className="flex justify-between mb-2">
                          <Link
                            to={`/product/${product.id}`}
                            className="text-lg font-medium text-gray-900 hover:text-shopez-600 transition-colors"
                          >
                            {product.name}
                          </Link>
                          <span className="text-lg font-medium">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                            }).format(totalItemPrice)}
                          </span>
                        </div>
                        
                        {product.discount ? (
                          <div className="flex items-baseline space-x-2 mb-2">
                            <span className="text-shopez-accent">
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(itemPrice)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(product.price)}
                            </span>
                          </div>
                        ) : (
                          <div className="mb-2">
                            <span>
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(product.price)} each
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              disabled={quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-1">{quantity}</span>
                            <button
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              disabled={quantity >= product.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Link to="/products">
                  <Button variant="link" className="text-shopez-600">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({cartItems.reduce((total, item) => total + item.quantity, 0)}):</span>
                  <span>{formattedTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formattedTotal}</span>
                </div>
              </div>
              
              <Button
                className="w-full mt-6 bg-shopez-accent hover:bg-shopez-500 flex items-center justify-center gap-2"
                asChild
              >
                <Link to="/checkout">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Accepted Payment Methods</h3>
                <div className="flex space-x-2">
                  <div className="p-2 border border-gray-200 rounded">
                    <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-6" />
                  </div>
                  <div className="p-2 border border-gray-200 rounded">
                    <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="MasterCard" className="h-6" />
                  </div>
                  <div className="p-2 border border-gray-200 rounded">
                    <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
