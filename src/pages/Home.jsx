import HeroBanner from "../components/HeroBanner";
import HowItWorks from "../components/HowItWorks";
import FeaturedItems from "../components/FeaturedItems";
import Statistics from "../components/Statistics";
import Leaderboard from "../components/Leaderboard";
import CategoryShowcase from "../components/CategoryShowcase";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Section 1: Hero Banner */}
      <HeroBanner />
      
      {/* Section 2: How It Works */}
      <HowItWorks />
      
      {/* Section 3: Featured Items */}
      <FeaturedItems />
      
      {/* Section 4: Statistics */}
      {/* <Statistics /> */}
      
      {/* Section 5: Leaderboard */}
      <Leaderboard />
      
      {/* Section 6: Category Showcase */}
      <CategoryShowcase />
      
      {/* Section 7: Testimonials */}
      {/* <Testimonials /> */}
      
      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join the Sustainable Revolution?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Start sharing, swapping, and saving today. Every item shared makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              Get Started Free
            </button>
            <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-full font-semibold transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}