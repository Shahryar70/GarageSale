// src/pages/Home/components/Testimonials.jsx
import { FaQuoteLeft, FaStar } from "react-icons/fa";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Donated my old sofa to a family in need. The joy on their faces was priceless!",
      name: "Maria Gonzalez",
      role: "Donor",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop"
    },
    {
      quote: "Swapped my unused tools for gardening supplies. Now I have a beautiful backyard!",
      name: "James Wilson",
      role: "Swapper",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    },
    {
      quote: "Earned EcoScore while decluttering my home. It's a win-win for everyone!",
      name: "Sophie Chen",
      role: "Community Member",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Community Says</h2>
          <p className="text-gray-600">Real stories from real users</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-green-500 text-2xl mb-4">
                <FaQuoteLeft />
              </div>
              <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
              
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  <div className="flex text-yellow-500 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-sm" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex justify-center space-x-2 mb-8">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
          <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-full font-semibold transition-colors">
            Read More Stories
          </button>
        </div>
      </div>
    </section>
  );
}