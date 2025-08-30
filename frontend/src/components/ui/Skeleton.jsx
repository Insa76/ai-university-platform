import React from 'react';

const Skeleton = ({ 
  className = '',
  variant = 'rectangular',
  width,
  height,
  ...props 
}) => {
  const baseClasses = 'skeleton bg-gray-200 rounded animate-pulse';
  
  const variantClasses = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded-full h-4'
  };

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div 
      className={classes} 
      style={style}
      {...props}
    />
  );
};

export default Skeleton;