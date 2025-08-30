import React from 'react';

const Card = ({ 
  children, 
  variant = 'default', 
  className = '', 
  hoverable = true,
  ...props 
}) => {
  const baseClasses = 'card transition-all duration-300';
  
  const variants = {
    default: 'bg-white border border-gray-100',
    primary: 'card-primary text-white border-0',
    secondary: 'card-secondary text-white border-0',
    outlined: 'bg-white border-2 border-gray-200'
  };

  const hoverClasses = hoverable ? 'hover:shadow-lg hover:-translate-y-1' : '';

  const classes = `${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;