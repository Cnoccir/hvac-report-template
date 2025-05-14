// components/ui/Subheading.js
import React from 'react';

/**
 * Consistent subheading component
 */
const Subheading = ({ children, className = '' }) => (
  <h4 className={`font-bold text-base mb-2 text-black ${className}`}>
    {children}
  </h4>
);

export default Subheading;