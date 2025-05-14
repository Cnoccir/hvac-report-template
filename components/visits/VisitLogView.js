// components/visits/VisitLogView.js
import React, { useState, useEffect } from 'react';
import { useConfig } from '../../lib/ConfigContext';
import SectionTitle from '../ui/SectionTitle';
import SectionSubtitle from '../ui/SectionSubtitle';

/**
 * Visit Log Component
 */
const VisitLogView = ({ expandedSchoolName }) => {
  const { config } = useConfig();
  const visitLogs = config.data.visitLogs || {};
  const [expandedSchool, setExpandedSchool] = useState(expandedSchoolName);
  
  // Update expandedSchool when expandedSchoolName prop changes
  useEffect(() => {
    if (expandedSchoolName) {
      setExpandedSchool(expandedSchoolName);
    }
  }, [expandedSchoolName]);
  
  // Toggle school expansion
  const toggleSchool = (schoolName) => {
    if (expandedSchool === schoolName) {
      setExpandedSchool(null);
    } else {
      setExpandedSchool(schoolName);
    }
  };
  
  return (
    <div>
      <SectionTitle>DETAILED VISIT LOGS BY SCHOOL</SectionTitle>
      <SectionSubtitle />

      {/* Empty state */}
      {Object.keys(visitLogs).length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-gray-400">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <p className="text-gray-600">No visit logs available for this report.</p>
          <p className="text-sm text-gray-500 mt-1">Visit logs will appear here when data is provided.</p>
        </div>
      )}

      {/* Accordions for each school */}
      <div className="space-y-4">
        {Object.entries(visitLogs).map(([schoolName, visits], schoolIdx) => {
          // Calculate total hours for this school
          const totalHours = visits.reduce((total, visit) => {
            const hours = parseFloat(visit.duration.split(' ')[0]);
            return total + hours;
          }, 0).toFixed(2);
          
          return (
            <div key={schoolIdx} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <button
                className="w-full px-4 py-3 text-left font-medium flex justify-between items-center focus:outline-none bg-gray-50 border-b border-gray-200"
                onClick={() => toggleSchool(schoolName)}
              >
                <span className="text-black">{schoolName}</span>
                <span className="text-gray-600">
                  {visits.length} visits | {totalHours} hours
                </span>
              </button>

              {expandedSchool === schoolName && (
                <div className="px-4 pb-4 space-y-3 pt-2">
                  {visits.map((visit, visitIdx) => (
                    <div key={visitIdx} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium text-black">{visit.date}</div>
                        <div className="text-sm text-gray-600">{visit.duration}</div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">Technician: {visit.technician}</div>
                      <div className="mt-2 pt-2 border-t">
                        <div className="text-sm font-medium mb-1 text-black">Work Completed:</div>
                        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                          {visit.summary.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VisitLogView;