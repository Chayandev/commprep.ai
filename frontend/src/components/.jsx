// ScrollArea.jsx
import React from 'react';

const ScrollArea = ({ children, className }) => {
  return (
    <div className={`overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${className}`} style={{ maxHeight: '300px' }}>
      {children}
    </div>
  );
};

export default ScrollArea;
