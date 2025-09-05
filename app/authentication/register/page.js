'use client';
import Alert from '@/app/components/Alert';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';


export default function Page() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [failedMessage, setFailedMessage] = useState('');
    const [isUsernameChecking, setIsUsernameChecking] = useState(false);
    const router = useRouter();


    const validateField = (name, value) => {
        let newErrors = { ...errors };

        switch (name) {
            case 'email':
                if (!value) {
                    newErrors.email = 'Email is required.';
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    newErrors.email = 'Email address is invalid.';
                } else {
                    delete newErrors.email;
                }
                break;
            case 'username':
                if (!value) {
                    newErrors.username = 'Username is required.';
                } else if (value.length < 3) {
                    newErrors.username = 'Username must be at least 3 characters.';
                } else {
                   
                    delete newErrors.username;
                }
                break;
            case 'password':
                if (!value) {
                    newErrors.password = 'Password is required.';
                } else if (value.length < 6) {
                    newErrors.password = 'Password must be at least 6 characters long.';
                } else {
                    delete newErrors.password;
                }
                // Re-validate confirm password if password changes to ensure consistency
                if (confirmPassword && value !== confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match.';
                } else if (newErrors.confirmPassword === 'Passwords do not match.' && value === confirmPassword) {
                    delete newErrors.confirmPassword;
                }
                break;
            case 'confirmPassword':
                if (!value) {
                    newErrors.confirmPassword = 'Confirm Password is required.';
                } else if (value !== password) {
                    newErrors.confirmPassword = 'Passwords do not match.';
                } else {
                    delete newErrors.confirmPassword;
                }
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    /**
     * Checks username availability by calling the backend API.
     * Sets loading state and updates errors based on API response.
     * @param {string} usernameValue - The username to check for availability.
     */
    const checkUsernameAvailability = async (usernameValue) => {
        setIsUsernameChecking(true);
        try {
            const response = await fetch('http://localhost:8000/api/auth/check-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: usernameValue }),
            });

            const data = await response.json();

            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                if (data.success === false) {
                    newErrors.username = 'Username is already taken.';
                } else {
                    if (newErrors.username === 'Username is already taken.') {
                        delete newErrors.username;
                    }
                }
                return newErrors;
            });

        } catch (error) {
            console.error('Error checking username availability:', error);
            setErrors((prevErrors) => ({ ...prevErrors, username: 'Failed to connect to the server for username check.' }));
        } finally {
            setIsUsernameChecking(false);
        }
    };

    /**
     * Handles changes in form input fields.
     * @param {Object} e - The event object from the input change.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Clear any previous general success/failure messages on input change
        setSuccessMessage('');
        setFailedMessage('');

        if (name === 'email') setEmail(value);
        if (name === 'username') setUsername(value);
        if (name === 'password') setPassword(value);
        if (name === 'confirmPassword') setConfirmPassword(value);

        // Always perform immediate validation for all fields on change
        validateField(name, value);

        // Implement debouncing for username availability check
        if (name === 'username') {
            // Only check availability if the username meets the minimum length
            // and there is no length-related error.
            if (value.length >= 3) {
                // We need to use a timeout to debounce the API call
                if (e.target.timeout) clearTimeout(e.target.timeout);
                e.target.timeout = setTimeout(() => {
                    // Check if a length error exists. If so, don't run the availability check.
                    // This relies on the state being updated synchronously, which isn't always
                    // the case with `setErrors`.
                    // A better approach is to check the value itself.
                    if (value.length >= 3) {
                        checkUsernameAvailability(value);
                    }
                }, 500); // Check after 500ms of no typing
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Clear previous messages
        setSuccessMessage('');
        setFailedMessage('');

        // Perform a final validation of all fields before submission
        validateField('email', email);
        validateField('username', username);
        validateField('password', password);
        validateField('confirmPassword', confirmPassword);
        
        // This is crucial: wait for the state update to propagate
        // You can use a callback or a temporary object to check the latest state
        let finalErrors = { ...errors };

        // Manually check if any of the fields are empty on submit, in case onBlur didn't fire
        if (!email) finalErrors.email = 'Email is required.';
        if (!username) finalErrors.username = 'Username is required.';
        if (!password) finalErrors.password = 'Password is required.';
        if (!confirmPassword) finalErrors.confirmPassword = 'Confirm Password is required.';
        setErrors(finalErrors); // Update the state with any new errors

        // If there are any errors or username is still checking, prevent submission
        if (Object.keys(finalErrors).length > 0 || isUsernameChecking) {
            setFailedMessage('Please correct the highlighted fields before submitting.');
            return;
        }

        try {
            let response = await fetch('http://localhost:8000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password })
            });
            let data = await response.json();
            console.log(data);

            if (response.ok && data.success) {
                // Clear all errors on successful registration
                setErrors({});
                setFailedMessage('');
                setSuccessMessage('Signup successful! Redirecting to login...');
                localStorage.setItem('token', data.authtoken);
                router.push("/authentication/login");

            } else {
                // Display error message from backend or a generic one
                setFailedMessage(data.message || 'Registration failed due to an unknown error.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setFailedMessage('Failed to connect to the server during registration.');
        }
    }

    // Determine if the submit button should be disabled
    const isSubmitDisabled = Object.keys(errors).length > 0 || isUsernameChecking || !email || !username || !password || !confirmPassword;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#4a00e0] to-[#8e2de2]">
            <div className="bg-black bg-opacity-70 p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md text-white text-center">

                <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-100">Create Your Account</h2>

                {/* Use the Alert component for messages */}
                {failedMessage && <Alert severity="error" message={failedMessage} />}
                {successMessage && <Alert severity="success" message={successMessage} />}
                {/* This alert should only show if there are errors and no general failure message is set */}
                {Object.keys(errors).length > 0 && !failedMessage && !successMessage && (
                    <Alert severity="error" message="Please correct the highlighted fields." />
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-left text-gray-300 text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            onBlur={() => validateField('email', email)} // Validate on blur as well
                            placeholder="Enter your email"
                            className={`w-full p-3 rounded-lg bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 selection:bg-indigo-500  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                            required
                        />
                        {errors.email && <p className="text-red-400 text-xs text-left mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-left text-gray-300 text-sm font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={handleChange}
                            onBlur={() => validateField('username', username)} // Validate on blur
                            placeholder="Choose a username"
                            className={`w-full p-3 rounded-lg bg-gray-700 border selection:bg-indigo-500  ${errors.username ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                            required
                        />
                        {isUsernameChecking && username.length >3 ? <p className="text-indigo-400 text-xs text-left mt-1">Checking availability...</p>:''}
                        {/* Display specific username messages based on state */}
                        {errors.username && <p className="text-red-400 text-xs text-left mt-1">{errors.username}</p>}
                        {/* Only show "Username is available" if there are no errors for username, it's not checking, and it meets length */}
                        {!isUsernameChecking && !errors.username && username && username.length >= 3 && <p className="text-green-400 text-xs text-left mt-1">Username is available</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-left text-gray-300 text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            onBlur={() => validateField('password', password)}
                            placeholder="Create a password"
                            className={`w-full p-3 rounded-lg bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 selection:bg-indigo-500  focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                            required
                        />
                        {errors.password && <p className="text-red-400 text-xs text-left mt-1">{errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-left text-gray-300 text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChange}
                            onBlur={() => validateField('confirmPassword', confirmPassword)}
                            placeholder="Confirm your password"
                            className={`w-full p-3 rounded-lg bg-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 selection:bg-indigo-500  focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                            required
                        />
                        {errors.confirmPassword && <p className="text-red-400 text-xs text-left mt-1">{errors.confirmPassword}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 mt-4 rounded-lg font-bold text-lg bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black transition duration-300 transform hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitDisabled}
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-8 text-gray-400 text-sm">
                    Already have an account?{' '}
                    {/* Replaced Next.js Link with a standard anchor tag */}
                    <a href="/authentication/login" className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline transition duration-200">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
}