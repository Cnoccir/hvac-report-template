// components/ui/Footer.js
import React from 'react';
import { useConfig } from '../../lib/ConfigContext';
import AmeLogo from './AmeLogo';

/**
 * Footer component for the report - styled with AME branding
 */
const Footer = () => {
  const { config } = useConfig();
  const companyName = config.reportInfo.client.companyName || 'AME Inc.';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white py-4 mt-8">
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