// components/ui/Footer.js
import React from 'react';
import { useConfig } from '../../lib/ConfigContext';
import AmeLogo from './AmeLogo';

/**
 * Footer component for the report
 */
const Footer = () => {
  const { config } = useConfig();
  const companyName = config.reportInfo.client.companyName || 'Company Name';
  const year = new Date().getFullYear();
  const colors = config.branding.colors;

  return (
    <footer 
      className="py-4 mt-8 text-white" 
      style={{ backgroundColor: colors.secondary }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <AmeLogo size="small" />
        </div>
        <p className="text-sm text-gray-300 my-2 md:my-0">
          Copyright {year} {companyName} All Rights Reserved
        </p>
        <p className="text-sm text-gray-300">Page 1 of 1</p>
      </div>
    </footer>
  );
};

export default Footer;