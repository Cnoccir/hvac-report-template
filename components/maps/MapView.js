// components/maps/MapView.js
import React, { useState } from 'react';
import { useConfig } from '../../lib/ConfigContext';
import SectionTitle from '../ui/SectionTitle';
import SectionSubtitle from '../ui/SectionSubtitle';

/**
 * Map View Component
 * 
 * In a production environment, this would use the Google Maps API
 */
const MapView = ({ selectedSchool, setSelectedSchool, handleViewSchoolDetails }) => {
  const { config } = useConfig();
  const locations = config.data.locations || [];
  const colors = config.branding.colors;
  
  return (
    <div>
      <SectionTitle>GEOGRAPHIC SERVICE DISTRIBUTION</SectionTitle>
      <SectionSubtitle />
      
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-4">
        <div className="text-center mb-4">
          <p>Google Maps integration is disabled in this demo.</p>
          <p className="text-sm text-gray-600">To enable maps, add a Google Maps API key to the environment variables.</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 h-64 flex items-center justify-center">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-gray-400">
              <circle cx="12" cy="10" r="3"></circle>
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"></path>
            </svg>
            <p className="font-medium text-gray-700">Map Placeholder</p>
          </div>
        </div>
      </div>
      
      {/* Display locations list as an alternative to map */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Service Locations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map(location => (
            <div 
              key={location.id}
              className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md cursor-pointer"
              onClick={() => handleViewSchoolDetails(location.name)}
            >
              <h4 className="font-medium">{location.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{location.address}</p>
              <div className="flex justify-between">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Visits: {location.visits}</span>
                <span className="text-xs" style={{ color: colors.primary }}>Hours: {location.hours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;