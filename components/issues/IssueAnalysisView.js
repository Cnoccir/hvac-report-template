// components/issues/IssueAnalysisView.js
import React, { useState } from 'react';
import { useConfig } from '../../lib/ConfigContext';
import SectionTitle from '../ui/SectionTitle';
import SectionSubtitle from '../ui/SectionSubtitle';
import Subheading from '../ui/Subheading';

/**
 * Issue Analysis Component
 */
const IssueAnalysisView = () => {
  const { config } = useConfig();
  const issues = config.data.issues || [];
  const schoolIssueData = config.data.schoolIssueData || [];
  const colors = config.branding.colors;
  
  // State for expanded issues
  const [expandedIssueId, setExpandedIssueId] = useState(null);
  
  // Calculate total issues across all schools
  const totalIssues = schoolIssueData.reduce((sum, school) => sum + school.issues, 0);
  
  // Get icon for issue type
  const getIssueIcon = (type) => {
    switch (type) {
      case 'connectivity':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
        );
      case 'heating':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
          </svg>
        );
      case 'airflow':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A7.5 7.5 0 0 1 12 21.75H12a7.5 7.5 0 0 1-7.92-12.445A7.5 7.5 0 0 0 12 3Z"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
    }
  };
  
  // Toggle issue expansion
  const toggleIssue = (issueId) => {
    if (expandedIssueId === issueId) {
      setExpandedIssueId(null);
    } else {
      setExpandedIssueId(issueId);
    }
  };
  
  return (
    <div>
      <SectionTitle>ANALYSIS OF RECURRING ISSUES</SectionTitle>
      <SectionSubtitle />

      {/* Summary statistics */}
      <div className="flex justify-around my-6 text-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-black">{schoolIssueData.length}</div>
          <div className="text-sm text-gray-600">Schools</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-black">{totalIssues}</div>
          <div className="text-sm text-gray-600">Total Issues</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-black">{issues.length}</div>
          <div className="text-sm text-gray-600">Critical Categories</div>
        </div>
      </div>

      {/* Critical issues section */}
      {issues.length > 0 && (
        <div className="mb-6">
          <Subheading>Critical Issues by Priority</Subheading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {issues.map((issue) => {
              const isExpanded = expandedIssueId === issue.id;
              
              return (
                <div 
                  key={issue.id} 
                  className={`border-l-4 rounded-lg shadow bg-white overflow-hidden border border-gray-200 hover:shadow-md transition-shadow ${
                    issue.priority === 'High' ? 'border-l-red-500' :
                    issue.priority === 'Medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
                  }`}
                  onClick={() => toggleIssue(issue.id)}
                >
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-md mr-3 ${
                        issue.type === 'connectivity' ? 'bg-blue-100 text-blue-600' : 
                        issue.type === 'heating' ? 'bg-red-100 text-red-600' :
                        issue.type === 'airflow' ? 'bg-cyan-100 text-cyan-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {getIssueIcon(issue.type)}
                      </div>
                      <h5 className="font-semibold text-black">{issue.name}</h5>
                    </div>
                    
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        issue.priority === 'High' ? 'bg-red-100 text-red-800' :
                        issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {issue.priority} Priority
                      </span>
                      <span className="text-xs text-gray-600">
                        {issue.frequency} ({issue.schools} schools)
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">
                      {issue.description}
                    </p>
                    
                    {isExpanded && (
                      <>
                        <div className="text-sm text-gray-700 mb-2">
                          <strong>Impact:</strong> {issue.impact}
                        </div>
                        
                        {issue.affectedEquipment && (
                          <div className="text-sm text-gray-700 mb-3">
                            <strong>Affected Equipment:</strong>
                            <ul className="list-disc ml-5 mt-1">
                              {issue.affectedEquipment.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-700 font-medium mb-3">
                        <strong>Recommendation:</strong> {issue.recommendation}
                      </p>
                      <button 
                        className="w-full flex items-center justify-center bg-gray-50 text-blue-500 border border-gray-200 rounded py-2 px-4 text-sm font-medium hover:bg-gray-100"
                      >
                        {isExpanded ? 'Show Less' : 'View Details'}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                          {isExpanded ? (
                            <path d="m18 15-6-6-6 6"/>
                          ) : (
                            <path d="m6 9 6 6 6-6"/>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* School issue data */}
      {schoolIssueData.length > 0 && (
        <div>
          <Subheading>Issues by School</Subheading>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schoolIssueData.map((school, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="w-32 text-sm">{school.name}</div>
                  <div className="flex-grow bg-gray-200 h-6 rounded-full overflow-hidden">
                    <div 
                      className="h-full flex items-center justify-center text-xs text-white"
                      style={{ 
                        width: `${Math.min(100, (school.issues / 10) * 100)}%`,
                        backgroundColor: colors.primary
                      }}
                    >
                      {school.issues}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueAnalysisView;