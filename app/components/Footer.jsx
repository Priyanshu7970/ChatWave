import React from 'react'
import { FiTwitter } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import Image from 'next/image';
 const Footer = ()=> {
  return (
        <footer className="bg-gray-950 text-gray-400 py-12 rounded-t-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="col-span-full md:col-span-1 text-center md:text-left">
            <a href="#" className="flex items-center justify-center md:justify-start space-x-2 text-white mb-4">
                         <Image height={20} width={30} src={'/logo.ico'} alt='Image not found'/>
             
              <span className="text-xl font-bold tracking-tight">ChatWave</span>
            </a>
            <p className="text-sm leading-relaxed mb-4">
              Connecting the world, one conversation at a time.
            </p>
            <p className="text-sm">&copy; {new Date().getFullYear()} ChatWave. All rights reserved.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-indigo-400 transition duration-200 text-sm">Home</a></li>
              <li><a href="#features" className="hover:text-indigo-400 transition duration-200 text-sm">Features</a></li>
              <li><a href="#services" className="hover:text-indigo-400 transition duration-200 text-sm">Services</a></li>
              <li><a href="#about" className="hover:text-indigo-400 transition duration-200 text-sm">About Us</a></li>
              <li><a href="#contact" className="hover:text-indigo-400 transition duration-200 text-sm">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-400 transition duration-200 text-sm">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition duration-200 text-sm">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition duration-200 text-sm">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-400 transition duration-200 text-sm">Support</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition duration-200 text-sm">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition duration-200 text-sm">Careers</a></li>
            </ul>
            <div className="flex space-x-4 mt-6 justify-center md:justify-start">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition duration-200" aria-label="GitHub">
                <FaGithub className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition duration-200" aria-label="LinkedIn">
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition duration-200" aria-label="Twitter">
                <FiTwitter className="w-6 h-6" />
               
              </a>
            </div>
          </div>
        </div>
      </footer>
  )
}
export default Footer;

