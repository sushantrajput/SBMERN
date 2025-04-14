
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Category } from "@/types/product";
import { ArrowRight } from "lucide-react";

const CategoriesPage = () => {
  const categories: { name: string; category: Category; image: string; description: string }[] = [
    {
      name: "Jewelry",
      category: "jewelry",
      image: "https://images.unsplash.com/photo-1584647830233-ec56c6cb3e5b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8amV3ZWxyeXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
      description: "Elegant jewelry pieces including necklaces, bracelets, and more to complement any outfit."
    },
    {
      name: "Electronics",
      category: "electronics",
      image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGVsZWN0cm9uaWNzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      description: "Cutting-edge electronics for everyday use, from earbuds to fitness trackers."
    },
    {
      name: "Accessories",
      category: "accessories",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWNjZXNzb3JpZXN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
      description: "Stylish accessories including bags, watches, and sunglasses to elevate your style."
    },
    {
      name: "Beauty",
      category: "beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXR5JTIwcHJvZHVjdHN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
      description: "Natural and organic beauty products to enhance your skin and personal care routine."
    },
    {
      name: "Home",
      category: "home",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8aG9tZSUyMGRlY29yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      description: "Home essentials and decor to make your living space both functional and beautiful."
    },
    {
      name: "Clothing",
      category: "clothing",
      image: "https://images.unsplash.com/photo-1589363358751-ab05797e315d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
      description: "Fashionable clothing for all occasions to keep you comfortable and stylish."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
            <p className="text-gray-600">
              Browse our wide range of product categories to find what you're looking for.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.category}
                to={`/products?category=${category.category}`}
                className="block group"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center text-shopez-600 font-medium">
                      <span>Browse Products</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
