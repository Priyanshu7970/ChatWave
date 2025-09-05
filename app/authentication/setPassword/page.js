'use client'; 

import React, { useState } from 'react';
import { Lock, CheckCircle, XCircle } from 'lucide-react'; // Importing icons from Lucide

const SetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasDigit: false,
    hasSpecialChar: false,
  });

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    validatePassword(value);
    // Also check if confirm password matches if it's already typed
    if (confirmPassword) {
      setPasswordMatch(value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(newPassword === value);
  };

  const validatePassword = (password) => {
    setPasswordCriteria({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasDigit: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
  const isFormValid = allCriteriaMet && passwordMatch && newPassword.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      console.log('Setting new password:', { newPassword });
      alert('Password set successfully! (Check console for data)');
      // Here you would typically send the newPassword to your API
    } else {
      alert('Please meet all password requirements and ensure passwords match.');
    }
  };

  const criteriaItem = (label, isMet) => (
    <li className={`flex items-center text-sm ${isMet ? 'text-green-400' : 'text-red-400'}`}>
      {isMet ? <CheckCircle size={16} className="mr-2" /> : <XCircle size={16} className="mr-2" />}
      {label}
    </li>
  );
 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#4a00e0] to-[#8e2de2] p-4">
      <div className="bg-black p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-4">Set Your New Password</h2>
        <p className="text-center text-white mb-8">Choose a strong, unique password.</p>

        <form onSubmit={handleSubmit}>
          {/* New Password Input */}
          <div className="mb-5">
            <label htmlFor="newPassword" className="block text-white text-sm font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
              <input
                type="password"
                id="newPassword"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 text-white bg-gray-800 placeholder-gray-400"
                placeholder="••••••••"
                value={newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
              <input
                type="password"
                id="confirmPassword"
                className={`pl-10 pr-4 py-2 w-full border ${!passwordMatch && confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 text-white bg-gray-800 placeholder-gray-400`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
            </div>
            {!passwordMatch && confirmPassword && (
              <p className="text-red-400 text-sm mt-2">Passwords do not match.</p>
            )}
          </div>

          {/* Password Criteria */}
          <div className="mb-6 bg-gray-800 p-4 rounded-md">
            <h3 className="text-white text-md font-semibold mb-3">Password must contain:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {criteriaItem('At least 8 characters', passwordCriteria.minLength)}
              {criteriaItem('An uppercase letter', passwordCriteria.hasUpperCase)}
              {criteriaItem('A lowercase letter', passwordCriteria.hasLowerCase)}
              {criteriaItem('A number', passwordCriteria.hasDigit)}
              {criteriaItem('A special character', passwordCriteria.hasSpecialChar)}
            </ul>
          </div>

          {/* Set Password Button */}
          <div>
            <button
              type="submit"
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition duration-200
                ${isFormValid ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' : 'bg-gray-500 cursor-not-allowed opacity-70'}`}
              disabled={!isFormValid}
            >
              <Lock className="mr-2" size={20} />
              Set Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordPage;