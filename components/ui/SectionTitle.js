// components/ui/SectionTitle.js
import React from 'react';

/**
 * Consistent section title component
 */
const SectionTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-bold uppercase mb-1 text-black ${className}`}>
    {children}
  </h3>
);

export default SectionTitle;