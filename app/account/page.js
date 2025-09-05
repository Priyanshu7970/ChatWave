'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const AccountPage = () => {
  // State for user data (mock data for demonstration)

  const [userData, setUserData] = useState({name:'',avatar:'',password:''});

  // State for form errors
  const [errors, setErrors] = useState({});

  // State for showing success/error messages after update
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error for the current field when typing
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle avatar upload (simplified - would involve actual file upload in a real app)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real application, you would upload this file to a server
      // and get a URL back. For now, we'll just use a FileReader to display it.
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevData) => ({
          ...prevData,
          avatar: reader.result, // This will be a Data URL for display
        }));
      };
      reader.readAsDataURL(file);
    }
  };
 
  // Validate form inputs
  const validateForm = () => {
    let newErrors = {};

    // Name validation
    if (!userData.name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (userData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    // Email validation
    if (!userData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Email address is invalid.';
    }

    // Password validation (only if user is trying to change password)
    if (userData.password) {
      if (userData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters long.';
      }
      // You can add more complex password validation here (e.g., requiring numbers, special characters)
      // Example:
      // else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}/.test(userData.password)) {
      //   newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
      // }

      if (userData.password !== userData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    } else if (userData.confirmPassword) {
      // If confirm password is typed but new password is not
      newErrors.password = 'Please enter a new password.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async(e) => {
    
    e.preventDefault();
    let token = localStorage.getItem('token');
    if(token){
    setMessage({ type: '', text: '' }); // Clear previous messages

    if (validateForm()) {
      // In a real application, you would send this data to your backend API
      // e.g., fetch('/api/user/update', { method: 'PUT', body: JSON.stringify(userData) })
      console.log('Updating user data:', userData);
       const response = await fetch('http://localhost:8000/api/users/updateuser',{
        method:'POST',
         headers:{
           'Content-Type':'application/json',
           'auth-token':`${token}`
         },
        body:JSON.stringify(userData)
       })
      
      // Simulate API call success
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Account updated successfully!' });
        // Clear password fields after successful update for security
        setUserData((prevData) => ({
          ...prevData,
          password: '',
          confirmPassword: '',
        }));
      }, 1000);
    } else {
      setMessage({ type: 'error', text: 'Please correct the errors in the form.' });
    }
  }
  else{
    router.push('/authentication/login');
  }
  };

  useEffect(()=>{
      const FetchUser = async()=>{ 
     let token  = localStorage.getItem('token');
     if(token){
    try{
     const userResponse = await fetch('http://localhost:8000/api/users/getuser', {
                    method: 'GET',
                    headers: { 'auth-token': `${token}` }
                });
                const data = await userResponse.json();
                console.log(data);
                setUserData({name:data.username,avatar:data.avatar,password:data.password});
              }
              catch(error){
                console.log(error);
              }
            }
            else{
              router.push('/authentication/login');
            }
  }
       FetchUser();
  },[])
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Account Settings</h2>

        {message.text && (
          <div
            className={`p-3 mb-4 rounded-md text-sm ${
              message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Avatar Section */}
          <div className="mb-6 text-center">
            <img
              src={userData.avatar.length>0?userData.avatar:'/Default_avatar.avif'}
              alt="User avatar"
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-indigo-500 mb-3"
            />
            
            <label htmlFor="avatar-upload" className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded-full transition duration-300 ease-in-out">
           
              Change Avatar
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white placeholder-gray-400 ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Your Name"
            />
            {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white placeholder-gray-400 ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white placeholder-gray-400 ${
                errors.password ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="********"
            />
            {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>}
          </div>

         

          {/* Submit Button */}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;