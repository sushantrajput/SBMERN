
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Star, Minus, Plus, Heart, Share2, ShoppingCart, ChevronRight, Truck, RotateCw, Shield } from "lucide-react";
import FeaturedProducts from "@/components/FeaturedProducts";
import { toast } from "@/components/ui/use-toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const product = products.find((p) => p.id === id);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // If product doesn't exist, redirect to 404
  if (!product) {
    navigate("/404");
    return null;
  }

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(product.price);
  
  const discountedPrice = product.discount
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }).format(product.price * (1 - product.discount / 100))
    : null;

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => (prev < product.stock ? prev + 1 : prev));
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleShareProduct = async () => {
    try {
      const productUrl = window.location.href;
      
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out this amazing product: ${product.name}`,
          url: productUrl
        });
        toast({
          title: "Product shared",
          description: "Thank you for sharing this product!"
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        await navigator.clipboard.writeText(productUrl);
        toast({
          title: "Link copied",
          description: "Product link has been copied to clipboard"
        });
      }
    } catch (error) {
      console.error("Error sharing product:", error);
      // Fallback when sharing fails
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Product link has been copied to clipboard"
        });
      } catch (clipboardError) {
        toast({
          title: "Sharing failed",
          description: "Please copy the URL from the address bar",
          variant: "destructive"
        });
      }
    }
  };

  // Find similar products
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-3">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex text-sm">
              <a href="/" className="text-gray-500 hover:text-shopez-600">Home</a>
              <ChevronRight className="h-4 w-4 mx-1 text-gray-400 self-center" />
              <a href="/products" className="text-gray-500 hover:text-shopez-600">Products</a>
              <ChevronRight className="h-4 w-4 mx-1 text-gray-400 self-center" />
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Thumbnail images would go here if we had multiple images */}
              <div className="hidden md:flex justify-center gap-4">
                <div 
                  className="w-20 h-20 border-2 border-shopez-500 rounded-md cursor-pointer overflow-hidden"
                  onClick={() => setSelectedImage(0)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Additional thumbnails would go here */}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : i < product.rating
                            ? "text-yellow-400 fill-current opacity-50"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">{product.rating.toFixed(1)} ({product.reviews} reviews)</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center">
                  {discountedPrice ? (
                    <>
                      <span className="text-3xl font-bold text-shopez-accent">{discountedPrice}</span>
                      <span className="ml-2 text-xl text-gray-500 line-through">{formattedPrice}</span>
                      <span className="ml-2 text-sm bg-shopez-accent text-white px-2 py-0.5 rounded">
                        {product.discount}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold">{formattedPrice}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {product.stock > 0 ? (
                    <span className="text-green-600">In Stock ({product.stock} available)</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-gray-700">{product.description}</p>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="border border-gray-300 rounded-md flex items-center">
                    <button
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-1 text-center w-12">{quantity}</span>
                    <button
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <Button
                      className="w-full bg-shopez-accent hover:bg-shopez-500 flex items-center justify-center gap-2"
                      onClick={() => addToCart(product, quantity)}
                      disabled={product.stock <= 0}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className={`flex-1 flex items-center justify-center gap-2 ${isInWishlist(product.id) ? 'bg-red-50 border-red-200' : ''}`}
                    onClick={handleWishlistToggle}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={handleShareProduct}
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 space-y-4">
                <div className="flex items-center">
                  <div className="mr-3 text-shopez-600">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-gray-600">Free standard shipping on orders over ₹3,500</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 text-shopez-600">
                    <RotateCw className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Easy Returns</p>
                    <p className="text-sm text-gray-600">30-day return policy for unused items</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 text-shopez-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Secure Checkout</p>
                    <p className="text-sm text-gray-600">Your data is protected with 256-bit encryption</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description, Reviews, etc. would go here */}
          
          {/* Similar Products */}
          <div className="mt-16">
            <FeaturedProducts 
              title="You May Also Like" 
              products={similarProducts}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
