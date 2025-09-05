import { FileText, Globe, Lock, MessageSquareText, Users, Video, Zap } from 'lucide-react'
import React from 'react'

const Features = () => {
    return (
        <section id="features" className="py-16 md:py-20 bg-gray-800 rounded-t-3xl -mt-8 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-400 mb-12">Powerful Features for Enhanced Communication</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature Card 1 */}
                    <div className="bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600 flex flex-col items-center text-center group">
                        <div className="bg-indigo-600 text-white p-4 rounded-full mb-6 group-hover:bg-indigo-500 transition duration-300">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-white"> Chat & Channels</h3>
                        <p className="text-gray-300 leading-relaxed">Create  private chat to collaborate with your  friends.</p>
                    </div>

                    {/* Feature Card 2 */}
                    <div className="bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600 flex flex-col items-center text-center group">
                        <div className="bg-indigo-600 text-white p-4 rounded-full mb-6 group-hover:bg-indigo-500 transition duration-300">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-white">Secure File Sharing</h3>
                        <p className="text-gray-300 leading-relaxed">Effortlessly share documents, images, and videos with end-to-end encryption for privacy.</p>
                    </div>

                    {/* Feature Card 3 */}
                    <div className="bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600 flex flex-col items-center text-center group">
                        <div className="bg-indigo-600 text-white p-4 rounded-full mb-6 group-hover:bg-indigo-500 transition duration-300">
                            {/* Import MessageSquareText from 'lucide-react' */}
                            <MessageSquareText className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-white">Instant & Secure Messaging</h3>
                        <p className="text-gray-300 leading-relaxed">Send messages instantly with end-to-end encryption, ensuring your conversations are always private.</p>
                    </div>

                    {/* Feature Card 4 */}
                    <div className="bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600 flex flex-col items-center text-center group">
                        <div className="bg-indigo-600 text-white p-4 rounded-full mb-6 group-hover:bg-indigo-500 transition duration-300">
                            <Zap className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-white">Real-time Messaging</h3>
                        <p className="text-gray-300 leading-relaxed">Send and receive messages instantly, ensuring you're always connected with your contacts.</p>
                    </div>

                    {/* Feature Card 5 */}
                    <div className="bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600 flex flex-col items-center text-center group">
                        <div className="bg-indigo-600 text-white p-4 rounded-full mb-6 group-hover:bg-indigo-500 transition duration-300">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-white">Privacy & Security</h3>
                        <p className="text-gray-300 leading-relaxed">Your conversations are protected with advanced encryption and robust security protocols.</p>
                    </div>

                    {/* Feature Card 6 */}
                    <div className="bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600 flex flex-col items-center text-center group">
                        <div className="bg-indigo-600 text-white p-4 rounded-full mb-6 group-hover:bg-indigo-500 transition duration-300">
                            <Globe className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-white">Cross-Platform Access</h3>
                        <p className="text-gray-300 leading-relaxed">Access your chats from any device – desktop, tablet, or mobile – with seamless synchronization.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Features
