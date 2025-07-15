import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    photo: "https://randomuser.me/api/portraits/men/11.jpg",
    quote: "MiniHive helped me earn extra income from home easily.",
  },
  {
    id: 2,
    name: "Jane Smith",
    photo: "https://randomuser.me/api/portraits/women/45.jpg",
    quote: "As a buyer, managing tasks has never been this simple!",
  },
  {
    id: 3,
    name: "Sam Wilson",
    photo: "https://randomuser.me/api/portraits/men/23.jpg",
    quote: "Great platform and easy to use dashboard for all roles.",
  },
];

export default function Testimonials() {
  return (
    <section className="my-16 px-4 max-w-4xl mx-auto">
      <h3 className="text-3xl font-bold mb-10 text-center text-yellow-500">
        What Our Users Say
      </h3>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
      >
        {testimonials.map(({ id, name, photo, quote }) => (
          <SwiperSlide key={id}>
            <div
              className="flex flex-col md:flex-row items-center rounded-lg p-6 space-y-4 md:space-y-0 md:space-x-6
                text-center md:text-left
                bg-gradient-to-r from-blue-50 via-blue-100 to-blue-300
                text-black shadow-lg"
            >
              <img
                src={photo}
                alt={name}
                className="w-20 h-20 rounded-full object-cover shadow"
              />
              <div>
                <div className="text-5xl text-white leading-none mb-2">“</div>
                <p className="italic mb-2">"{quote}"</p>
                <p className="font-semibold">{name}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
