
import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Heart, Share2 } from "lucide-react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "@/components/ui/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
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
    
  const handleWishlistClick = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.origin + `/product/${product.id}`,
        });
      } else {
        const url = `${window.location.origin}/product/${product.id}`;
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Product link has been copied to clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Sharing failed",
        description: "Unable to share the product.",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
      <div className="relative pt-[100%]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {product.discount && (
          <Badge variant="shopez" className="absolute top-2 right-2">
            {product.discount}% OFF
          </Badge>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <h3
            className="text-lg font-medium text-gray-900 hover:text-shopez-600 cursor-pointer mb-1"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center mt-auto mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-current text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
          
          <div className="ml-auto">
            {product.stock > 0 ? (
              <span className="text-xs text-green-600">In Stock</span>
            ) : (
              <span className="text-xs text-red-600">Out of Stock</span>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div>
            {discountedPrice ? (
              <div className="flex items-center">
                <span className="font-medium text-shopez-accent">{discountedPrice}</span>
                <span className="text-sm text-gray-500 line-through ml-2">{formattedPrice}</span>
              </div>
            ) : (
              <span className="font-medium">{formattedPrice}</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              className={`rounded-full h-8 w-8 ${isInWishlist(product.id) ? 'bg-red-50' : ''}`}
              onClick={handleWishlistClick}
            >
              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="default" 
              size="icon"
              className="rounded-full h-8 w-8 bg-shopez-accent hover:bg-shopez-500"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
