import { Sparkles } from 'lucide-react'
import React from 'react'

const About = () => {
  return (
     <section id="about" className="py-16 md:py-20 bg-gray-800">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 px-4 sm:px-6 lg:px-8">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-400 mb-6">About ChatWave</h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              At ChatWave, our mission is to redefine online communication by providing a secure, reliable, and feature-rich platform for everyone. We believe in fostering connections, whether for personal conversations, professional collaborations, or community building.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Founded on the principles of privacy and innovation, ChatWave continually evolves to meet the demands of modern digital interactions. Join our growing community and experience communication without boundaries.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            {/* Placeholder for an image or illustration */}
            <div className="bg-indigo-800 rounded-3xl w-full max-w-md h-64 md:h-80 flex items-center justify-center shadow-lg">
              <Sparkles className="w-24 h-24 text-indigo-400 opacity-50" />
            </div>
          </div>
        </div>
      </section>
  )
}

export default About
