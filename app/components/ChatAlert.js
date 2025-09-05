// components/Alert.jsx
import React, { useEffect, useState } from 'react';
import { XCircle, CheckCircle } from 'lucide-react';

const ChatAlert = ({ message, type, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Automatically hide the alert after a duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const alertClasses = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
  };

  const icon = type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />;

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 text-white transition-opacity duration-300 ${alertClasses[type] || 'bg-gray-500 border-gray-600'}`}
      role="alert"
    >
      {icon}
      <p className="font-medium">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          if (onClose) {
            onClose();
          }
        }}
        className="ml-auto p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
        aria-label="Close alert"
      >
        <XCircle size={16} />
      </button>
    </div>
  );
};

export default ChatAlert;