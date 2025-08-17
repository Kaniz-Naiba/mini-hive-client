import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer id="footer" className="relative bg-gray-900 text-white pt-16 pb-10 overflow-hidden">
      {/* Decorative Wave Background */}
      <img
        src="/bg.png" 
        alt="Wave Background"
        className="absolute top-0 left-0 w-full h-auto object-cover pointer-events-none z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Logo Card */}
        <div className="flex flex-col items-center text-center gap-2">
          <img
            src="/mini-hive2.png" 
            className="h-16 w-16 object-contain rounded-full border-2 border-white shadow-lg"
          />
          <span className="text-2xl font-bold text-yellow-500">MiniHive</span>
        </div>

        {/* Footer Links */}
        <div className="flex flex-col md:flex-row items-center gap-6 text-sm">
          <Link
            to="/privacy-policy"
            className="hover:text-yellow-400 transition duration-300"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-400">Contact Us: support@minihive.com</span>
        </div>

        {/* Social Icons */}
        <div className="flex gap-5 text-2xl">
          <a
            href="https://github.com/Kaniz-Naiba"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition duration-300"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/kaniz-naiba/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition duration-300"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://www.facebook.com/tanbina.kaniz.naiba.2024/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition duration-300"
          >
            <FaFacebook />
          </a>
        </div>
      </div>
    </footer>
  );
}
