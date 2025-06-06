
import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-hotel text-white pt-12 pb-6">
      <div className="hotel-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Hotel Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Hotel className="h-8 w-8 text-hotel-accent" />
              <span className="text-2xl font-display font-bold">Urban Hotels</span>
            </div>
            <p className="text-gray-300 mb-4">
              Experience luxury and comfort at our Urban Hotels, your home away from home.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-hotel-accent" />
                <span className="text-gray-300">10 Colombo Street, Urban Hotels, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-hotel-accent" />
                <span className="text-gray-300">+94 (077) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-hotel-accent" />
                <span className="text-gray-300">info@urbanhotels.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-display font-medium mb-4 border-b border-gray-600 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/rooms" className="text-gray-300 hover:text-white transition-colors">Rooms & Suites</Link>
              </li>
              <li>
                <Link to="/amenities" className="text-gray-300 hover:text-white transition-colors">Amenities</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/FAQs" className="text-gray-300 hover:text-white transition-colors">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-display font-medium mb-4 border-b border-gray-600 pb-2">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for special offers and updates.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-l outline-none text-gray-800 w-full"
              />
              <button
                type="submit"
                className="bg-hotel-accent px-4 py-2 rounded-r text-white hover:brightness-110 transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 mt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Urban Hotels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
