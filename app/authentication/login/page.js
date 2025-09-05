'use client'
import React, { useContext, useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react'; // Importing icons from Lucide
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Alert from '@/app/components/Alert';

const page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); 
  const router = useRouter(); 
  const [Severity,setSeverity] = useState();
  const [SeverityMessage,setSeverityMessage] = useState(); 

  const handleSubmit = async(e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/api/auth/login',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({email,password})
    })
    const data = await response.json(); 
    console.log("button clicked..."); 
    if(data.success === true){ 
    
      setSeverity('success'); 
      setSeverityMessage('Login Successfully...');  
      localStorage.setItem('token',data.token);
      setTimeout(()=>{
          router.push('/');
      },2000)
       
    } 
    else{
      setSeverity('error');
      setSeverityMessage('Please use valid credentials');

      
    }
     
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#4a00e0] to-[#8e2de2] p-4">
      <div className="bg-black p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Welcome Back!</h2>
        <p className="text-center text-white mb-8">Log in to your account</p>
         <Alert severity={Severity} message={SeverityMessage}/>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-5">
            <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
              <input
                type="email"
                id="email"
                className="pl-10 pr-4 py-2 w-full border border-gray-300  rounded-md selection:bg-indigo-500 selection:border-2 selection:rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
              <input
                type="password"
                id="password"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md selection:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

        

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              <LogIn className="mr-2" size={20} />
              Log In
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            
            Don't have an account?{' '}
            <Link href={'/authentication/register'} className="text-indigo-600 hover:text-indigo-700 font-medium transition duration-200">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;