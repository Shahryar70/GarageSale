// src/pages/Home/components/CategoryShowcase.jsx
export default function CategoryShowcase() {
  const categories = [
    { icon: "🛋️", name: "Furniture", count: 324 },
    { icon: "👕", name: "Clothing", count: 589 },
    { icon: "📚", name: "Books", count: 412 },
    { icon: "🔧", name: "Tools", count: 187 },
    { icon: "🎮", name: "Electronics", count: 256 },
    { icon: "🧸", name: "Toys", count: 198 },
    { icon: "🍳", name: "Kitchen", count: 345 },
    { icon: "🚲", name: "Sports", count: 167 },
    { icon: "🎨", name: "Other", count: 123 },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
          <p className="text-gray-600">Find exactly what you're looking for</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer hover:border-2 hover:border-green-500 group"
            >
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="font-bold mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count} items</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
            Explore All Categories
          </button>
        </div>
      </div>
    </section>
  );
}