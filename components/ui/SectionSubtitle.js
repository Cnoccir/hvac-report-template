// components/ui/SectionSubtitle.js
import React from 'react';
import { useConfig } from '../../lib/ConfigContext';

/**
 * Consistent section subtitle component that uses config data
 */
const SectionSubtitle = ({ range, client, className = '' }) => {
  // If range or client are not provided, use values from config
  const { config } = useConfig();
  
  const dateRange = range || config.reportInfo.dateRange.display;
  const clientName = client || config.reportInfo.client.name;
  
  return (
    <p className={`text-sm text-gray-600 mb-4 ${className}`}>
      {dateRange} | {clientName}
    </p>
  );
};

export default SectionSubtitle;