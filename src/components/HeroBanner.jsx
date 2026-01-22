// src/pages/Home/components/HeroBanner.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../../src/context/AuthContext";

export default function HeroBanner() {
  const { user } = useAuth();

  return (
    <section className="relative bg-gradient-to-r from-green-500 to-blue-600 text-white py-20 md:py-32">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Give What You Don't Need,<br />
            Find What You Do
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Join the sustainable sharing revolution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink
              to="/browse-items"
              className="bg-white text-green-700 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-lg transition-colors"
            >
              Browse Items
            </NavLink>
            {!user && (
              <NavLink
                to="/register"
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors"
              >
                Sign Up Free
              </NavLink>
            )}
            <NavLink
              to="/how-it-works"
              className="border-2 border-white hover:bg-white/10 text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors"
            >
              How It Works
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}