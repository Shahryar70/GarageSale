// src/pages/Home/components/Leaderboard.jsx
import { FaTrophy, FaMedal, FaAward } from "react-icons/fa";

export default function Leaderboard() {
  const leaders = [
    { rank: 1, name: "Sarah J.", points: 1250, title: "Donation Champion", avatar: "👩" },
    { rank: 2, name: "Mike T.", points: 980, title: "Swap Master", avatar: "👨" },
    { rank: 3, name: "Lisa P.", points: 750, title: "Community Hero", avatar: "👩" },
    { rank: 4, name: "Alex R.", points: 650, title: "Eco Warrior", avatar: "👨" },
    { rank: 5, name: "Emma S.", points: 520, title: "Sharing Star", avatar: "👩" },
  ];

  const rankIcons = {
    1: <FaTrophy className="text-yellow-500 text-2xl" />,
    2: <FaMedal className="text-gray-400 text-2xl" />,
    3: <FaAward className="text-amber-700 text-2xl" />
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <span className="mr-2">🏆</span>
            Top Eco Warriors This Month
          </h2>
          <p className="text-gray-600">Our most active community members</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {leaders.map((leader, index) => (
              <div
                key={leader.rank}
                className={`flex items-center p-6 border-b last:border-b-0 ${
                  index < 3 ? "bg-gradient-to-r from-green-50 to-blue-50" : ""
                }`}
              >
                <div className="flex items-center justify-center w-12">
                  {rankIcons[leader.rank] || (
                    <span className="text-2xl font-bold text-gray-400">#{leader.rank}</span>
                  )}
                </div>
                
                <div className="flex items-center flex-1">
                  <div className="text-3xl mr-4">{leader.avatar}</div>
                  <div>
                    <h3 className="font-bold text-lg">{leader.name}</h3>
                    <p className="text-gray-600 text-sm">{leader.title}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{leader.points.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button className="text-green-600 hover:text-green-700 font-semibold flex items-center justify-center mx-auto">
              View Full Leaderboard
              <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}