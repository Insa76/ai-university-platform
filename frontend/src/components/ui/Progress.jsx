import React from 'react';

const Progress = ({ 
  value, 
  max = 100, 
  className = '',
  showPercentage = false,
  color = 'primary'
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    accent: 'bg-accent-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="progress-container bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`progress-bar ${colorClasses[color]} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

export default Progress;