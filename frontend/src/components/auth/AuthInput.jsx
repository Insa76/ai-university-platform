import React from 'react';
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';

const AuthInput = ({ 
  label, 
  type = 'text', 
  error, 
  showPasswordToggle = false,
  passwordVisible = false,
  onPasswordToggle,
  icon,
  ...props 
}) => {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        
        <input
          type={type}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
            icon ? 'pl-10' : ''
          } ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
              : 'border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
          }`}
          {...props}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={onPasswordToggle}
          >
            {passwordVisible ? (
              <FiEyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <FiEye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <div className="mt-2 flex items-center text-red-600">
          <FiAlertCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default AuthInput;