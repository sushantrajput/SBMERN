
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { Filter, Category } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter as FilterIcon, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") as Category | null;
  
  const [filters, setFilters] = useState<Filter>({
    category: initialCategory,
    minPrice: 0,
    maxPrice: 30000, // Changed to rupees
    rating: 0,
    inStock: true,
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();

  const categories: { value: Category; label: string }[] = [
    { value: "accessories", label: "Accessories" },
    { value: "beauty", label: "Beauty" },
    { value: "clothing", label: "Clothing" },
    { value: "electronics", label: "Electronics" },
    { value: "home", label: "Home" },
    { value: "jewelry", label: "Jewelry" },
  ];

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCategoryChange = (category: Category | null) => {
    setFilters({ ...filters, category });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters({ ...filters, minPrice: value[0], maxPrice: value[1] });
  };

  const handleRatingChange = (rating: number) => {
    setFilters({ ...filters, rating });
  };

  const handleInStockChange = (checked: boolean) => {
    setFilters({ ...filters, inStock: checked });
  };

  const resetFilters = () => {
    setFilters({
      category: null,
      minPrice: 0,
      maxPrice: 30000, // Changed to rupees
      rating: 0,
      inStock: false,
    });
    setSearchTerm("");
  };

  const filteredProducts = products.filter((product) => {
    // Filter by search term
    if (
      searchTerm &&
      !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !product.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by category
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Filter by price range
    if (
      product.price < filters.minPrice! ||
      product.price > filters.maxPrice!
    ) {
      return false;
    }

    // Filter by rating
    if (filters.rating && product.rating < filters.rating) {
      return false;
    }

    // Filter by stock
    if (filters.inStock && product.stock <= 0) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
            <p className="text-gray-600">
              Discover our wide range of high-quality products.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Mobile filter button */}
            {isMobile && (
              <div className="mb-4">
                <Button
                  variant="outline"
                  onClick={toggleFilters}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <span>Filters</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>
            )}

            {/* Filter sidebar */}
            <div
              className={`${
                isMobile
                  ? showFilters
                    ? "block"
                    : "hidden"
                  : "block"
              } w-full md:w-64 space-y-6`}
            >
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-3">Search</h2>
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-3">Categories</h2>
                  <div className="space-y-2">
                    <Button
                      variant={filters.category === null ? "default" : "outline"}
                      className={
                        filters.category === null ? "bg-shopez-500" : ""
                      }
                      onClick={() => handleCategoryChange(null)}
                    >
                      All
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category.value}
                          variant={
                            filters.category === category.value
                              ? "default"
                              : "outline"
                          }
                          className={
                            filters.category === category.value
                              ? "bg-shopez-500"
                              : ""
                          }
                          onClick={() => handleCategoryChange(category.value)}
                        >
                          {category.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-3">Price Range</h2>
                  <div className="px-2">
                    <Slider
                      defaultValue={[filters.minPrice!, filters.maxPrice!]}
                      max={30000}
                      step={1000}
                      onValueChange={handlePriceChange}
                      className="mb-6"
                    />
                    <div className="flex items-center justify-between">
                      <span>₹{filters.minPrice}</span>
                      <span>₹{filters.maxPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-3">Rating</h2>
                  <div className="space-y-2">
                    {[0, 4, 4.5].map((rating) => (
                      <div
                        key={rating}
                        className="flex items-center"
                        onClick={() => handleRatingChange(rating)}
                      >
                        <input
                          type="radio"
                          checked={filters.rating === rating}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        {rating === 0 ? (
                          <span>Any rating</span>
                        ) : (
                          <div className="flex items-center">
                            <span>{rating}+ </span>
                            <span className="text-yellow-500 ml-1">★</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={filters.inStock}
                      onCheckedChange={handleInStockChange}
                    />
                    <Label htmlFor="inStock">In stock only</Label>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>

            {/* Products grid */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} products
                </p>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Sort by:</span>
                  <select className="border rounded-md p-1 text-sm">
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-lg text-gray-600">
                      No products found matching your criteria.
                    </p>
                    <Button
                      variant="link"
                      onClick={resetFilters}
                      className="text-shopez-600"
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
