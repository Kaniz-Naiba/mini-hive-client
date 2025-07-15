import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'aos/dist/aos.css';

import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import { FaCoins } from 'react-icons/fa';
import CountUp from "react-countup";
import AOS from 'aos';



export default function BestWorkers() {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });

    fetch(`http://localhost:5000/top-workers`)
      .then(res => res.json())
      .then(data => setWorkers(data))
      .catch(err => console.error('Failed to load top workers:', err));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="my-16 px-4 max-w-7xl mx-auto">
      <h3 className="text-3xl font-bold mb-10 text-center text-yellow-500">
        Best Workers
      </h3>

      <Slider {...settings}>
        {workers.map(({ _id, name, coins, img }, index) => {
          const isTopThree = index < 3;

          return (
            <div
              key={_id || index}
              data-aos="fade-up"
              className={`
                relative bg-white rounded-xl p-6 flex flex-col items-center
                shadow-md transition-transform duration-300
                ${isTopThree ? 'scale-110 shadow-xl' : 'scale-90'}
                hover:scale-105 hover:shadow-lg
                mx-2
              `}
            >
              {/* Rank Badge with medals */}
              <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white font-bold text-sm
                ${
                  index === 0
                    ? 'bg-yellow-400'
                    : index === 1
                    ? 'bg-gray-400'
                    : index === 2
                    ? 'bg-orange-400'
                    : 'bg-blue-600'
                }
              `}>
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
              </span>

              {/* Profile image */}
              <img
                src={img || ''}
                alt={name}
                className={`rounded-full object-cover border-4 border-blue-200 mb-4
                  ${isTopThree ? 'w-28 h-28' : 'w-20 h-20'}
                  transition-transform duration-300
                `}
              />

              {/* Name */}
              <h4 className={`font-semibold text-center text-gray-800
                ${isTopThree ? 'text-lg' : 'text-sm'}
              `}>
                {name}
              </h4>

              {/* Coins */}
              <p className="text-yellow-500 flex items-center gap-2 mt-2 font-semibold">
                <FaCoins size={18} />
                <CountUp end={coins} duration={1.5} separator="," />
              </p>
            </div>
          );
        })}
      </Slider>
    </section>
  );
}
