import React from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const slides = [
  {
    heading: "Welcome to MicroTasker",
    title: "Earn money by completing small tasks easily.",
    image: "https://i.ibb.co/WvCPYVVK/businessman-blurred-background-with-people-connection-icon-business-leadership-chart.jpg", 
  },
  {
    heading: "Connect with Buyers",
    title: "Find tasks that match your skills and get paid.",
    image: "https://i.ibb.co/23sxL5bZ/business-plan-concept-3d-rendering.jpg",
  },
  {
    heading: "Manage Your Tasks",
    title: "Create, track, and manage your tasks seamlessly.",
    image: "https://i.ibb.co/3yQCKf84/discussing-mobile-app.jpg",
  },
];

export default function HeroSlider() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="text-white">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        transitionTime={800}
      >
        {slides.map(({ heading, title, image }, idx) => (
          <div
            key={idx}
            className="relative h-[80vh] md:h-screen w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50 z-10"></div>

            {/* Slide content */}
            <div className="relative z-20 flex flex-col justify-center items-center h-full px-4 text-center">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
                {heading}
              </h2>
              <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-6 drop-shadow-sm">
                {title}
              </p>
              <button
                onClick={handleGetStarted}
                className="bg-amber-50 text-black font-semibold px-6 py-3 rounded-full hover:bg-yellow-500 transition"
              >
                Get Started
              </button>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}    