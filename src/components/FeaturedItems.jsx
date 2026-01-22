// src/pages/Home/components/FeaturedItems.jsx
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ItemCard from "./ItemCard";

export default function FeaturedItems() {
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Mock data - replace with API call
  const featuredItems = [
    { id: 1, title: "Wooden Dining Table", type: "Donate", location: "New York, NY", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop" },
    { id: 2, title: "iPhone 12 Pro", type: "Swap", location: "Los Angeles, CA", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w-400&h=300&fit=crop" },
    { id: 3, title: "Leather Sofa", type: "Sell", location: "Chicago, IL", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop" },
    { id: 4, title: "Gardening Tools Set", type: "Donate", location: "Miami, FL", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop" },
    { id: 5, title: "Designer Handbag", type: "Swap", location: "Seattle, WA", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop" },
    { id: 6, title: "Mountain Bike", type: "Sell", location: "Denver, CO", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop" },
  ];

  const filters = ["All", "Donate", "Swap", "Sell"];

  const filteredItems = activeFilter === "All" 
    ? featuredItems 
    : featuredItems.filter(item => item.type === activeFilter);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Items</h2>
            <p className="text-gray-600">Discover amazing items shared by our community</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  activeFilter === filter
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-full font-semibold transition-colors">
            View All Items
          </button>
        </div>
      </div>
    </section>
  );
}