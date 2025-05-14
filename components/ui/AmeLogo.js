// components/ui/AmeLogo.js
import React from 'react';
import { useConfig } from '../../lib/ConfigContext';

/**
 * Logo component that can be customized through the configuration
 */
const AmeLogo = ({ size = 'medium', className = '', style = {} }) => {
  const { config } = useConfig();
  const logoConfig = config.branding.logo || {};
  const logoUrl = logoConfig.url;
  const logoAlt = logoConfig.alt || 'Company Logo';
  
  // Determine size based on the prop
  const sizeClass = 
    size === 'small' ? 'h-8' : 
    size === 'large' ? 'h-20' : 
    'h-12'; // medium is default
  
  // If there's a logo URL in the configuration, use it
  if (logoUrl) {
    return (
      <img 
        src={logoUrl} 
        alt={logoAlt} 
        className={`${sizeClass} ${className}`} 
        style={style}
      />
    );
  }
  
  // If no logo URL, create a fallback text-based logo
  return (
    <div 
      className={`${sizeClass} flex items-center font-bold text-white ${className}`} 
      style={style}
    >
      {config.reportInfo.client.companyName || 'Company Logo'}
    </div>
  );
};

export default AmeLogo;