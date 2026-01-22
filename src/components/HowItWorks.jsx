// src/pages/Home/components/HowItWorks.jsx
import {React, useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { FaUpload, FaHandshake, FaTrophy, FaArrowRight } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HowItWorks = () => {
  const [canSlideNext, setCanSlideNext] = useState(true);
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  
  const steps = [
    {
      title: "LIST YOUR ITEMS",
      desc: "Tag items as Donate, Swap, or Sell",
      icon: <FaUpload className="text-green-600 text-4xl" />,
      details: [
        "Donate: Help someone in need",
        "Swap: Trade for something useful",
        "Sell: Last resort for cash"
      ]
    },
    {
      title: "CONNECT & ARRANGE",
      desc: "Get matched with interested users",
      icon: <FaHandshake className="text-blue-600 text-4xl" />,
      details: [
        "AI-powered matching",
        "Secure messaging",
        "Safe meeting arrangements"
      ]
    },
    {
      title: "COMPLETE & EARN",
      desc: "Complete transactions & earn EcoScore",
      icon: <FaTrophy className="text-purple-600 text-4xl" />,
      details: [
        "Rate your experience",
        "Earn sustainability points",
        "Climb the leaderboard"
      ]
    },
    {
      title: "BUILD COMMUNITY",
      desc: "Join the sustainable sharing movement",
      icon: <FaHandshake className="text-amber-600 text-4xl" />,
      details: [
        "Share success stories",
        "Join local events",
        "Earn badges & rewards"
      ]
    }
  ];

  const handleSlideChange = (swiper) => {
    setCanSlidePrev(!swiper.isBeginning);
    setCanSlideNext(!swiper.isEnd);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
          <h2 className="text-4xl font-extrabold text-gray-900">
            How <span className='text-green-600'>GarageSale</span> Works
          </h2>
          <p className="text-gray-600 max-w-lg border-l-2 border-green-500 pl-4">
            A sustainable sharing revolution: Donate First, Swap Second, Sell Last
          </p>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Pagination, Navigation]}
          onSlideChange={handleSlideChange}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom'
          }}
          spaceBetween={20}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3.2 }
          }}
          className="pb-16"
        >
          {steps.map((step, index) => (
            <SwiperSlide key={index} className="h-full">
              <div className="relative border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition h-full group">
               
                
                {/* Icon */}
                <div className="mb-6">{step.icon}</div>
                
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                
                {/* Description */}
                <p className="text-gray-600 mb-4">{step.desc}</p>
                
                {/* Details List */}
                <ul className="space-y-2 mb-10">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="text-green-500 mr-2">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Arrow Button */}
                <a className="absolute bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-green-100 group-hover:bg-green-500 transition-all duration-300">
                  <FaArrowRight className="text-lg text-gray-800 group-hover:text-white transition-colors" />
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-6 mt-4">
          <button
            className={`swiper-button-prev-custom flex items-center gap-2 p-2 rounded-full text-base transition ${
              canSlidePrev 
                ? 'font-bold text-gray-900 hover:text-green-600' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <FaChevronLeft />
            <span>Prev</span>
          </button>

          <button
            className={`swiper-button-next-custom flex items-center gap-2 p-2 rounded-full text-base transition ${
              canSlideNext 
                ? 'font-bold text-gray-900 hover:text-green-600' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Next</span>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;