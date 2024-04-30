import React from "react";
import { Link } from "react-router-dom";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";

const Footer = () => {
  // Placeholder data for footer links
  const businessLinks = [
    { label: "Home", path: "/" },
    { label: "Search Businesses", path: "/search" },
    { label: "Categories", path: "/categories" },
    { label: "Featured Businesses", path: "/featured" },
  ];

  const resourcesLinks = [
    { label: "FAQ", path: "/faq" },
    { label: "Contact Us", path: "/contact" },
    { label: "Blog", path: "/blog" },
    { label: "Terms of Service", path: "/terms" },
  ];

  const aboutLinks = [
    { label: "About Us", path: "/about" },
    { label: "Our Team", path: "/team" },
    { label: "Testimonials", path: "/testimonials" },
    { label: "Privacy Policy", path: "/privacy" },
  ];

  return (
    <footer className="bg-[#1d0c58] text-white py-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between px-6">
        <div className="md:w-1/4">
          <h2 className="text-2xl mb-4">Explore</h2>
          <ul>
            {businessLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.path} className="hover:text-gray-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:w-1/4">
          <h2 className="text-2xl mb-4">Resources</h2>
          <ul>
            {resourcesLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.path} className="hover:text-gray-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:w-1/4">
          <h2 className="text-2xl mb-4">About Us</h2>
          <ul>
            {aboutLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.path} className="hover:text-gray-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:w-1/4">
          <h2 className="text-2xl mb-4">Connect</h2>
          <div className="flex items-center">
            <AiFillFacebook
              size={30}
              className="mr-4 cursor-pointer hover:text-gray-400"
            />
            <AiFillInstagram
              size={30}
              className="mr-4 cursor-pointer hover:text-gray-400"
            />
            <AiOutlineTwitter
              size={30}
              className="mr-4 cursor-pointer hover:text-gray-400"
            />
            <AiFillYoutube
              size={30}
              className="cursor-pointer hover:text-gray-400"
            />
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} localBiz Connect.</p>
        <div className="mt-2">
          <Link to="/terms" className="hover:text-gray-400 mr-4">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:text-gray-400">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
