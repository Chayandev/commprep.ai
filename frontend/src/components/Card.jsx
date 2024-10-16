// Card.jsx
import React from 'react';

const Card = ({ children, className }) => {
  return (
    <div className={`border rounded-lg p-4 shadow-md ${className}`}>
      {children}
    </div>
  );
};

export default Card;
