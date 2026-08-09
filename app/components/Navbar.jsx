'use client'
import { CircleUser } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react' 



const Navbar = ()=> { 
  const [user,setUser] = useState(false);
  useEffect(()=>{ 
    let token = localStorage.getItem('token'); 
    if(token){
      setUser(true);
    }
     
  },[]);
  return (
    <nav className="bg-gray-800 shadow-lg p-4 sticky top-0 z-50 rounded-b-xl">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <Link href={'/'} className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition duration-300">
            <Image height={20} width={30} src={'/logo.ico'} alt='Image not found'/>
            <span className="text-2xl font-bold tracking-tight">ChatWave</span>
          </Link> 
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-md p-2 transition duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-4 6h4"></path>
              </svg>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link href={"#home"} className="text-gray-300 hover:text-indigo-400 font-medium transition duration-300">Home</Link>
            <Link href={"#features"} className="text-gray-300 hover:text-indigo-400 font-medium transition duration-300">Features</Link>
            <Link href={"#services"} className="text-gray-300 hover:text-indigo-400 font-medium transition duration-300">Services</Link>
            <Link href={"#about"} className="text-gray-300 hover:text-indigo-400 font-medium transition duration-300">About Us</Link>
            <Link href={"/chat"} className="text-gray-300 hover:text-indigo-400 font-medium transition duration-300">Chat</Link>
          </div>

          <div className="hidden md:flex space-x-4">
             {user===true?<Link href={'/account'}><CircleUser size={32} strokeWidth={1} /></Link>:<><Link href={'/authentication/login'} className="px-6 py-2 border border-indigo-400 text-indigo-400 rounded-full hover:bg-indigo-900 transition duration-300 ease-in-out font-semibold">
              Login
            </Link>
            <Link href={'/authentication/register'} className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out shadow-lg font-semibold">
              Sign Up
            </Link></>}
          </div>
        </div>
      </nav>
  )
}
export default Navbar ;

