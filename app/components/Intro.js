'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const Intro = () => {  
   const router = useRouter();
  const handleClick = ()=>{
    let token = localStorage.getItem('token');  
    if(token){
        router.push('/chat');
    } 
    else{
      router.push('/authentication/login');
    }

  }
  return (
    <section id="home" className="py-20 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-xl rounded-b-3xl">
        <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            Connect Instantly, Share Seamlessly.
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 opacity-90 animate-fade-in-up delay-200">
            ChatWave is your go-to app for crystal-clear conversations, secure file sharing, and vibrant chats.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up delay-400">
            <button onClick={handleClick} className="px-8 py-4 bg-white text-indigo-700 rounded-full text-lg font-bold shadow-xl hover:scale-105 transform transition duration-300 ease-in-out hover:bg-gray-100">
              Get Started Free
            </button>
          
          </div>
        </div>
      </section>
  )
}

export default Intro;
