import React from 'react';

const AuthCheckbox = ({ label, error, ...props }) => {
  return (
    <div className="mb-5">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-offset-2"
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={props.id} className="font-medium text-gray-700">
            {label}
          </label>
        </div>
      </div>
      {error && (
        <div className="mt-1 text-red-600 text-sm">{error}</div>
      )}
    </div>
  );
};

export default AuthCheckbox;