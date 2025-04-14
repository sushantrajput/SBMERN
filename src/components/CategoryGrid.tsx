import React from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "@/types/product";

interface CategoryItem {
  name: string;
  category: Category;
  image: string;
  itemCount: number;
}

const categories: CategoryItem[] = [
  {
    name: "Jewelry",
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1584647830233-ec56c6cb3e5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    itemCount: 125,
  },
  {
    name: "Electronics",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    itemCount: 214,
  },
  {
    name: "Accessories",
    category: "accessories",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    itemCount: 156,
  },
  {
    name: "Beauty",
    category: "beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    itemCount: 98,
  },
  {
    name: "Home",
    category: "home",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    itemCount: 142,
  },
  {
    name: "Clothing",
    category: "clothing",
    image: "https://images.unsplash.com/photo-1589363358751-ab05797e315d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    itemCount: 189,
  },
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: Category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of categories to find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <div
              key={category.category}
              className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
              onClick={() => handleCategoryClick(category.category)}
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.itemCount} items</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
