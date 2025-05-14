// components/ui/AmeLogo.js
import React from 'react';
import Image from 'next/image';
import { useConfig } from '../../lib/ConfigContext';

/**
 * Logo component that can be customized through the configuration
 * Uses the actual AME logo by default but allows configuration override
 */
const AmeLogo = ({ size = 'medium', className = '', style = {} }) => {
  const { config } = useConfig();
  const logoConfig = config.branding.logo || {};
  
  // AME default logo from S3
  const defaultLogoUrl = "https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/tutor-logo.png";
  const logoUrl = logoConfig.forceCustomLogo ? logoConfig.url : defaultLogoUrl;
  const logoAlt = logoConfig.alt || 'AME Inc. Logo';
  
  // Determine size based on the prop
  const logoHeight = size === "large" ? 60 : size === "small" ? 32 : 45;
  const logoWidth = size === "large" ? 180 : size === "small" ? 100 : 140;
  
  return (
    <div className={`${size === "large" ? "w-64" : size === "small" ? "w-32" : "w-48"} h-auto`}>
      <div className="relative">
        <Image 
          src={logoUrl}
          alt={logoAlt}
          width={logoWidth}
          height={logoHeight}
          style={{
            objectFit: 'contain',
            objectPosition: 'left',
            maxWidth: '100%',
            height: 'auto'
          }}
          unoptimized={true} // To ensure direct loading from S3
        />
      </div>
    </div>
  );
};

export default AmeLogo;