// src/pages/Home/components/Statistics.jsx
import { useState, useEffect } from "react";
import { FaRecycle, FaHandHoldingHeart, FaExchangeAlt, FaDollarSign, FaLeaf } from "react-icons/fa";

export default function Statistics() {
  const [counters, setCounters] = useState({
    items: 0,
    donations: 0,
    swaps: 0,
    saved: 0,
    waste: 0
  });

  const targets = {
    items: 5000,
    donations: 2500,
    swaps: 1200,
    saved: 50000,
    waste: 10000
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 100;
    const stepDuration = duration / steps;

    const interval = setInterval(() => {
      setCounters(prev => ({
        items: Math.min(prev.items + Math.ceil(targets.items / steps), targets.items),
        donations: Math.min(prev.donations + Math.ceil(targets.donations / steps), targets.donations),
        swaps: Math.min(prev.swaps + Math.ceil(targets.swaps / steps), targets.swaps),
        saved: Math.min(prev.saved + Math.ceil(targets.saved / steps), targets.saved),
        waste: Math.min(prev.waste + Math.ceil(targets.waste / steps), targets.waste)
      }));
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: <FaRecycle />, value: counters.items, label: "Items Shared", suffix: "+" },
    { icon: <FaHandHoldingHeart />, value: counters.donations, label: "Donations Completed", suffix: "+" },
    { icon: <FaExchangeAlt />, value: counters.swaps, label: "Successful Swaps", suffix: "+" },
    { icon: <FaDollarSign />, value: counters.saved, label: "Saved by Community", suffix: "+" },
    { icon: <FaLeaf />, value: counters.waste, label: "Waste Prevented", suffix: "+ kg" }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-green-600 to-blue-700 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <span className="mr-2">🌍</span>
            Community Impact
          </h2>
          <p className="text-xl opacity-90">Together we're making a difference</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-3 flex justify-center">
                <div className="bg-white/20 p-4 rounded-full">
                  {stat.icon}
                </div>
              </div>
              <div className="text-4xl font-bold mb-2">
                {stat.value.toLocaleString()}{stat.suffix}
              </div>
              <p className="text-sm opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}