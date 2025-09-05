import { CheckCircle, Code, Smartphone, Sparkles } from 'lucide-react'
import React from 'react'

const Services = () => {
  return (
     <section id="services" className="py-16 md:py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-400 mb-12">What ChatWave Offers You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service Card 1 */}
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg flex items-start space-x-6 border border-gray-700 hover:shadow-xl transition duration-300">
              <div className="bg-purple-700 text-white p-4 rounded-full flex-shrink-0">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-white">Intuitive User Interface</h3>
                <p className="text-gray-300 leading-relaxed">Enjoy a clean, user-friendly design that makes chatting and navigating effortless for everyone.</p>
              </div>
            </div>

            {/* Service Card 2 */}
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg flex items-start space-x-6 border border-gray-700 hover:shadow-xl transition duration-300">
              <div className="bg-green-700 text-white p-4 rounded-full flex-shrink-0">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-white">Reliable Performance</h3>
                <p className="text-gray-300 leading-relaxed">Our robust infrastructure ensures stable connections and minimal latency, even during peak usage.</p>
              </div>
            </div>

            {/* Service Card 3 */}
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg flex items-start space-x-6 border border-gray-700 hover:shadow-xl transition duration-300">
              <div className="bg-yellow-700 text-white p-4 rounded-full flex-shrink-0">
                <Smartphone className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-white">Mobile Accessibility</h3>
                <p className="text-gray-300 leading-relaxed">Dedicated mobile apps for iOS and Android, keeping you connected on the go.</p>
              </div>
            </div>

            {/* Service Card 4 */}
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg flex items-start space-x-6 border border-gray-700 hover:shadow-xl transition duration-300">
              <div className="bg-red-700 text-white p-4 rounded-full flex-shrink-0">
                <Code className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-white">Developer Friendly APIs</h3>
                <p className="text-gray-300 leading-relaxed">Integrate ChatWave into your existing applications with our comprehensive and well-documented APIs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Services;
