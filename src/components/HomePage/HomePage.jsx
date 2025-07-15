import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import HeroSlider from './HeroSlider';
import BestWorkers from './BestWorkers';
import Testimonials from './Testimonials';
import CountUp from 'react-countup';

export default function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <main>
      <HeroSlider />
      <BestWorkers />
      <Testimonials />

      {/* About Us Section */}
      <section
        id="about"
        className="my-12 px-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8"
      >
        {/* Left side (image) */}
        <div className="md:w-1/2" data-aos="fade-right">
          <img
            src="https://i.ibb.co/93Z3cBcv/social-media-entertainment-lifestyle-graphic-concept.jpg"
            alt="About MiniHive"
            className="w-full rounded-lg shadow"
          />
        </div>

        {/* Right side (text) */}
        <div className="md:w-1/2 text-center md:text-left" data-aos="fade-left">
          <h3 className="text-3xl font-bold mb-4 text-yellow-500">About Us</h3>
          <p className="text-gray-700 leading-relaxed">
            MiniHive is a platform dedicated to connecting workers and buyers worldwide.
            Our mission is to create a reliable, efficient, and user-friendly environment
            where everyone can grow by completing and assigning micro tasks easily and transparently.
          </p>
        </div>
      </section>

     {/* How It Works Section */}
<section
  className="my-16 px-4 max-w-7xl mx-auto text-center"
  data-aos="zoom-in-up"
>
  <h3 className="text-3xl font-bold mb-12 text-yellow-500">How It Works</h3>
  <div className="grid md:grid-cols-4 gap-8">
    {[
      {
        title: 'Sign Up',
        icon: '📝',
        desc: 'Create a free account in seconds.',
        bg: 'bg-yellow-100',
        border: 'border-yellow-300',
        text: 'text-yellow-800',
      },
      {
        title: 'Browse Tasks',
        icon: '🔍',
        desc: 'Find tasks based on your skillset.',
        bg: 'bg-blue-100',
        border: 'border-blue-300',
        text: 'text-blue-800',
      },
      {
        title: 'Submit Work',
        icon: '📤',
        desc: 'Complete tasks and submit proof.',
        bg: 'bg-purple-100',
        border: 'border-purple-300',
        text: 'text-purple-800',
      },
      {
        title: 'Get Paid',
        icon: '💰',
        desc: 'Receive coins and withdraw to your wallet.',
        bg: 'bg-green-100',
        border: 'border-green-300',
        text: 'text-green-800',
      },
    ].map(({ title, icon, desc, bg, border, text }, i) => (
      <div
        key={i}
        className={`${bg} ${border} ${text} border-2 rounded-xl shadow-md p-6 hover:scale-105 transition-transform duration-300`}
        data-aos="fade-up"
        data-aos-delay={i * 100}
      >
        <div className="text-5xl mb-4">{icon}</div>
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-sm">{desc}</p>
      </div>
    ))}
  </div>
</section>


<section id="why-choose" className="relative h-[400px] my-12">
  {/* Video Background */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover z-0"
  >
    <source src="/video.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  {/* Overlay */}
  <div className="absolute inset-0  bg-opacity-50 z-10" />

  {/* Content */}
  <div
    className="relative z-20 px-4 max-w-7xl mx-auto h-full flex flex-col justify-center items-center text-center text-white"
    data-aos="fade-up"
  >
    <h3 className="text-3xl font-bold mb-4 text-yellow-500">Why Choose MiniHive?</h3>
    <p className="max-w-2xl">
      MiniHive connects workers and buyers in a seamless platform that’s easy to use, reliable, and fast.
    </p>
  </div>
</section>

{/* Trusted By Numbers Section */}
<section
  className="my-20 px-4 max-w-7xl mx-auto text-center"
  data-aos="fade-up"
>
  <h3 className="text-3xl font-bold text-yellow-500 mb-12 ">
    Trusted by Thousands
  </h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
    {[
      { label: 'Total Users', value: 5000, suffix: '+' },
      { label: 'Tasks Completed', value: 12000, suffix: '+' },
      { label: 'Coins Paid', value: 85000, suffix: '+' },
      { label: 'Countries', value: 30, suffix: '+' },
    ].map(({ label, value, suffix }, i) => (
      <div
        key={i}
        className="bg-white shadow-md rounded-2xl py-8 px-6 hover:shadow-xl transition-shadow duration-300"
        data-aos="fade-up"
        data-aos-delay={i * 100}
      >
        <p className="text-4xl font-extrabold text-indigo-600">
          <CountUp end={value} duration={2} suffix={suffix} />
        </p>
        <p className="text-lg font-medium text-gray-600 mt-3">{label}</p>
      </div>
    ))}
  </div>
</section>

      

     
      {/* CTA Section */}
      <section
        className="my-16 px-4 max-w-4xl mx-auto bg-gradient-to-r from-amber-300 to-yellow-500 rounded-lg text-white p-10 text-center"
        data-aos="zoom-in"
      >
        <h3 className="text-2xl font-bold mb-4">Ready to Start Earning or Hiring?</h3>
        <p className="mb-6">
          Join MiniHive today and experience a new way of working and hiring!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/register"
            className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100 transition"
          >
            Join as Worker
          </a>
          <a
            href="/register"
            className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100 transition"
          >
            Join as Buyer
          </a>
        </div>
      </section>
    </main>
  );
}
