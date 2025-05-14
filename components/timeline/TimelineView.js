// components/timeline/TimelineView.js
import React from 'react';
import { useConfig } from '../../lib/ConfigContext';
import SectionTitle from '../ui/SectionTitle';
import SectionSubtitle from '../ui/SectionSubtitle';
import Subheading from '../ui/Subheading';

/**
 * Timeline View Component
 */
const TimelineView = () => {
  const { config } = useConfig();
  const visits = config.data.visits || [];
  const calendarData = config.metrics.calendar || [];
  const colors = config.branding.colors;
  
  // Group visits by month and week
  const groupVisitsByWeek = () => {
    const grouped = {};
    
    visits.forEach(visit => {
      const date = new Date(visit.date);
      const month = date.toLocaleString('default', { month: 'long' });
      const weekOfMonth = Math.ceil(date.getDate() / 7);
      const weekKey = `${month} Week ${weekOfMonth}`;
      
      if (!grouped[weekKey]) {
        grouped[weekKey] = [];
      }
      
      grouped[weekKey].push(visit);
    });
    
    return grouped;
  };
  
  const groupedVisits = groupVisitsByWeek();
  
  return (
    <div>
      <SectionTitle>SERVICE VISIT TIMELINE</SectionTitle>
      <SectionSubtitle />

      {/* Service intensity calendar */}
      {calendarData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
          <Subheading>Service Intensity Calendar</Subheading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calendarData.map((monthData, idx) => (
              <div key={idx} className="border rounded p-2">
                <h5 className="font-medium text-center mb-2">{monthData.month} 2025</h5>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(monthData.weeks).map(([week, hours], i) => (
                    <div key={i} className="flex items-center">
                      <div className="text-xs w-24 text-gray-600">{week}</div>
                      <div className="flex-grow h-8 rounded-md relative"
                        style={{
                          backgroundColor: hours > 0
                            ? `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, ${Math.min(0.2 + (hours / 40), 0.8)})`
                            : colors.lightGrey
                        }}
                      >
                        {hours > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                            {hours} hrs
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline visualization */}
      {Object.keys(groupedVisits).length > 0 && (
        <div className="mb-6">
          <Subheading>Service Activity Timeline</Subheading>

          {Object.entries(groupedVisits).map(([weekName, visits], weekIdx) => (
            <div key={weekIdx} className="mb-8">
              <h5 className="font-medium text-black border-b border-gray-300 pb-1 mb-2">{weekName}</h5>

              <div className="space-y-4">
                {visits.map((visit, visitIdx) => {
                  const visitDate = new Date(visit.date);
                  
                  return (
                    <div key={visitIdx} className="flex">
                      <div className="mr-4 text-center">
                        <div className="w-16 text-xs bg-gray-100 rounded-t p-1 font-semibold">
                          {visitDate.toLocaleString('default', { month: 'short' })}
                        </div>
                        <div className="w-16 h-12 flex items-center justify-center font-bold text-lg rounded-b text-white" 
                          style={{ backgroundColor: colors.primary }}>
                          {visitDate.getDate()}
                        </div>
                      </div>

                      <div className="flex-grow bg-white rounded-lg shadow p-3 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <h6 className="font-semibold text-black">{visit.location}</h6>
                          <span className="bg-gray-100 text-black text-xs px-2 py-1 rounded font-medium">
                            {visit.hours} hrs
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Technician: {visit.tech}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimelineView;