// pages/index.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  Menu, 
  X, 
  Calendar, 
  Map, 
  BarChart2, 
  FileText, 
  AlertTriangle, 
  Clock,
  Navigation
} from 'lucide-react';
import { useConfig } from '../lib/ConfigContext';
import { trackTabChange } from '../utils/analytics';
import { 
  LineChart, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Line 
} from 'recharts';

// Import tab configuration
import { tabConfig } from '../lib/tabConfig';

/**
 * Main report page component
 */
export default function HVACServiceReport() {
  // Access configuration
  const { config } = useConfig();
  
  // Extract necessary config values
  const { title, client, dateRange } = config.reportInfo;
  const { colors } = config.branding;
  const { favicon } = config.branding;
  const enabledSections = config.sections;
  const defaultTab = config.settings?.defaultTab || 'executive';
  
  // Component state
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSchoolName, setExpandedSchoolName] = useState(null);
  const [expandedIssueId, setExpandedIssueId] = useState(null);
  const [expandedSchool, setExpandedSchool] = useState(expandedSchoolName);

  // Update when the prop changes
  useEffect(() => {
    if (expandedSchoolName) {
      setExpandedSchool(expandedSchoolName);
    }
  }, [expandedSchoolName]);

  // Filter tabs based on enabled sections in config
  const availableTabs = tabConfig.filter(tab => enabledSections[tab.id]);

  // Safe version that doesn't use window object for SSR compatibility
  const handleViewSchoolDetails = (schoolName) => {
    // Only switch to visits tab if it's enabled
    if (enabledSections.visits) {
      setActiveTab('visits');
      setExpandedSchoolName(schoolName);
    }
  };

  // Handle tab change with analytics tracking
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (config.settings?.enableAnalytics) {
      trackTabChange(tabId);
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
  
  // Toggle school expansion
  const toggleSchool = (schoolName) => {
    if (expandedSchool === schoolName) {
      setExpandedSchool(null);
    } else {
      setExpandedSchool(schoolName);
    }
  };

  // Generate the page title
  const pageTitle = `${client.companyName} - ${client.name} ${title}`;

  // UI COMPONENTS
  const SectionTitle = ({ children, className = '' }) => (
    <h3 className={`text-lg font-bold uppercase mb-1 text-black ${className}`}>
      {children}
    </h3>
  );

  const SectionSubtitle = ({ range, client, className = '' }) => {
    const dateRangeText = range || dateRange.display;
    const clientName = client || config.reportInfo.client.name;
    
    return (
      <p className={`text-sm text-gray-600 mb-4 ${className}`}>
        {dateRangeText} | {clientName}
      </p>
    );
  };

  const Subheading = ({ children, className = '' }) => (
    <h4 className={`font-bold text-base mb-2 text-black ${className}`}>
      {children}
    </h4>
  );

  const AmeLogo = ({ size = 'medium', className = '', style = {} }) => {
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

  const Footer = () => {
    const companyName = config.reportInfo.client.companyName || 'Company Name';
    const year = new Date().getFullYear();
    
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

  // SECTION COMPONENTS
  // Executive Summary Component
  const ExecutiveSummaryView = () => {
    const clientName = config.reportInfo.client.name;
    const companyName = config.reportInfo.client.companyName;
    const dateRange = config.reportInfo.dateRange.display;
    const generateDate = config.reportInfo.generateDate;
    const keyFindings = config.data.executiveSummary?.keyFindings || [];
    const recommendations = config.data.executiveSummary?.recommendations || [];
    const criticalIssues = config.data.executiveSummary?.criticalIssues || [];
    
    // Extract metrics data
    const totalLocations = config.metrics?.summary?.locations || 0;
    const totalVisits = config.metrics?.summary?.visits || 0;
    const totalHours = config.metrics?.summary?.hours || 0;
    const totalTechnicians = config.metrics?.summary?.technicians || 0;
    
    return (
      <div>
        <div className="text-center mb-6">
          <AmeLogo size="large" />
          <div className="mt-4">
            <SectionTitle>EXECUTIVE SUMMARY</SectionTitle>
            <SectionSubtitle />
          </div>
        </div>

        {/* Company info and header information */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-base font-bold text-black">{companyName}</div>
            <div className="text-sm text-gray-600">{config.reportInfo.client.companyAddress?.line1}</div>
            <div className="text-sm text-gray-600">
              {config.reportInfo.client.companyAddress?.city}, {config.reportInfo.client.companyAddress?.state} {config.reportInfo.client.companyAddress?.zip}
            </div>
            <div className="text-sm text-gray-600">Tel: {config.reportInfo.client.companyPhone}</div>
          </div>
          <div className="bg-gray-100 p-3 rounded border-l-4" style={{ borderColor: colors.primary }}>
            <div className="text-xl font-bold text-black">HVAC SERVICE REPORT</div>
            <div className="text-sm text-gray-600">Generated: {generateDate}</div>
          </div>
        </div>

        {/* Summary statistics cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" style={{ borderColor: colors.primary }}>
            <div className="text-3xl font-bold text-black">{totalLocations}</div>
            <div className="text-sm font-medium text-gray-600">Schools</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" style={{ borderColor: colors.primary }}>
            <div className="text-3xl font-bold text-black">{totalVisits}</div>
            <div className="text-sm font-medium text-gray-600">Visits</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" style={{ borderColor: colors.primary }}>
            <div className="text-3xl font-bold text-black">{totalHours}</div>
            <div className="text-sm font-medium text-gray-600">Hours</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" style={{ borderColor: colors.primary }}>
            <div className="text-3xl font-bold text-black">{totalTechnicians}</div>
            <div className="text-sm font-medium text-gray-600">Technicians</div>
          </div>
        </div>

        {/* Summary text */}
        <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
          <p className="mb-4 text-black">
            Between {dateRange}, {companyName} conducted <strong>{totalVisits} maintenance visits</strong> across {totalLocations} {clientName} facilities, totaling <strong>{totalHours} labor hours</strong>. This bi-weekly maintenance program has provided consistent monitoring, troubleshooting, and seasonal transition services for the district's HVAC systems.
          </p>

          <div className="mb-4">
            <h4 className="font-bold mb-2 text-black">Key Findings</h4>
            <ul className="list-disc pl-5 space-y-1 text-black">
              {keyFindings.map((finding, index) => (
                <li key={index}>{finding}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2 text-black">Recommendations</h4>
            <p className="mb-2 text-black">Based on these observations, we recommend:</p>
            <ul className="list-disc pl-5 space-y-1 text-black">
              {recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Critical issues */}
        {criticalIssues.length > 0 && (
          <div>
            <Subheading>Critical Issues Requiring Follow-up</Subheading>
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Issue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Schools Affected
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Recommendation
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {criticalIssues.map((issue, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                        {issue.issue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          issue.priority === 'High' ? 'bg-red-100 text-red-800' : 
                          issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                          {issue.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {issue.schoolsAffected}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {issue.recommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Metrics View Component
  const MetricsView = () => {
    // Extract necessary data from config
    const { locations, technicians } = config.data;
    const dateRange = config.reportInfo.dateRange.display;
    const clientName = config.reportInfo.client.name;
    const monthlyHours = config.metrics.monthly || [];
    
    // Calculate total metrics (or use from config if provided)
    const totalLocations = config.metrics.summary?.locations || locations.length;
    const totalVisits = config.metrics.summary?.visits || 
      locations.reduce((sum, location) => sum + location.visits, 0);
    const totalHours = config.metrics.summary?.hours || 
      locations.reduce((sum, location) => sum + location.hours, 0);
    const totalTechnicians = config.metrics.summary?.technicians || 
      (technicians ? technicians.length : 0);
  
    return (
      <div>
        <SectionTitle>SERVICE METRICS OVERVIEW</SectionTitle>
        <SectionSubtitle range={dateRange} client={clientName} />
  
        {/* Summary statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" 
               style={{ borderColor: colors.primary }}>
            <div className="text-3xl font-bold text-black">{totalLocations}</div>
            <div className="text-sm font-medium text-gray-600">Schools Serviced</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" 
               style={{ borderColor: colors.primary }}>
            <div className="text-3xl font-bold text-black">{totalVisits}</div>
            <div className="text-sm font-medium text-gray-600">Total Visits</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" 
               style={{ borderColor: colors.primary }}>
            <div className="text-3xl font-bold text-black">{totalHours}</div>
            <div className="text-sm font-medium text-gray-600">Labor Hours</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" 
               style={{ borderColor: colors.primary }}>
            <div className="text-3xl font-bold text-black">{totalTechnicians}</div>
            <div className="text-sm font-medium text-gray-600">Technicians</div>
          </div>
        </div>
  
        {/* Labor hours by school chart */}
        <div className="mb-8">
          <Subheading>Labor Hours by School</Subheading>
          <div className="bg-white p-4 rounded-lg shadow h-64 border border-gray-200">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[...locations].sort((a, b) => b.hours - a.hours)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.lightGrey} />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{fontSize: 10}} />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value} hours`, 'Service Hours']} />
                <Bar dataKey="hours" fill={colors.primary} name="Service Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        {/* Monthly hours comparison */}
        {monthlyHours.length > 0 && (
          <div className="mb-8">
            <Subheading>Monthly Service Hours</Subheading>
            <div className="bg-white p-4 rounded-lg shadow h-64 border border-gray-200">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyHours}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.lightGrey} />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value} hours`, 'Service Hours']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    stroke={colors.primary} 
                    activeDot={{ r: 8 }} 
                    name="Service Hours" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
  
        {/* Technician data table */}
        {technicians && technicians.length > 0 && (
          <div className="mb-6">
            <Subheading>Service by Technician</Subheading>
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Technician
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Visits
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Hours
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      % of Total Hours
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {technicians.map((tech, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                        {tech.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {tech.visits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {tech.hours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {Math.round((tech.hours / totalHours) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
  
        {/* School data table */}
        <div>
          <Subheading>Service by School</Subheading>
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    School
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Visits
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Hours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {locations.map((school, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {school.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {school.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {school.visits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {school.hours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Map View Component
  const MapView = ({ selectedSchool, setSelectedSchool, handleViewSchoolDetails }) => {
    const locations = config.data.locations || [];
    
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
              <Map className="mx-auto mb-2 text-gray-400" size={48} />
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

  // Timeline View Component
  const TimelineView = () => {
    const visits = config.data.visits || [];
    const calendarData = config.metrics.calendar || [];
    
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

  // Issue Analysis Component
  const IssueAnalysisView = () => {
    const issues = config.data.issues || [];
    const schoolIssueData = config.data.schoolIssueData || [];
    
    // Calculate total issues across all schools
    const totalIssues = schoolIssueData.reduce((sum, school) => sum + school.issues, 0);
    
    // Get icon for issue type
    const getIssueIcon = (type) => {
      switch (type) {
        case 'connectivity':
          return <AlertTriangle size={20} />;
        case 'heating':
          return <AlertTriangle size={20} />;
        case 'airflow':
          return <AlertTriangle size={20} />;
        default:
          return <AlertTriangle size={20} />;
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

  // Visit Log Component
  const VisitLogView = () => {
    const visitLogs = config.data.visitLogs || {};
    
    return (
      <div>
        <SectionTitle>DETAILED VISIT LOGS BY SCHOOL</SectionTitle>
        <SectionSubtitle />
  
        {/* Empty state */}
        {Object.keys(visitLogs).length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <Clock size={48} className="mx-auto mb-3 text-gray-400" />
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

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={`${title} for ${client.name}`} />
        {favicon && <link rel="icon" href={favicon} />}
        <style jsx global>{`
          :root {
            --color-primary: ${colors.primary};
            --color-secondary: ${colors.secondary};
            --color-accent: ${colors.accent || '#3A6EE8'};
            --color-light: ${colors.light || '#6AAFE8'};
          }
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
              Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          }
          .text-primary {
            color: var(--color-primary);
          }
          .text-secondary {
            color: var(--color-secondary);
          }
          .bg-primary {
            background-color: var(--color-primary);
          }
          .bg-secondary {
            background-color: var(--color-secondary);
          }
          .border-primary {
            border-color: var(--color-primary);
          }
          .border-t-primary {
            border-top-color: var(--color-primary);
          }
          .border-l-primary {
            border-left-color: var(--color-primary);
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-white font-sans">
        {/* Header */}
        <header className="bg-secondary text-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <AmeLogo size="small" />
              <h1 className="ml-4 text-xl font-bold uppercase">{client.name} HVAC Analysis</h1>
            </div>
            <div className="text-sm">{dateRange.display}</div>
            <button
              className="md:hidden p-2 rounded border border-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={20} color="white" />
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile navigation menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mb-4 bg-white rounded-lg shadow border border-gray-200">
              <div className="p-2 space-y-1">
                {availableTabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`w-full px-3 py-2 rounded-md text-left flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'bg-red-50 text-primary font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      handleTabChange(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Desktop tabs */}
          <div className="hidden md:block mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px space-x-6">
                {availableTabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab content */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            {activeTab === 'executive' && enabledSections.executive && <ExecutiveSummaryView />}
            {activeTab === 'map' && enabledSections.map && 
              <MapView
                selectedSchool={selectedSchool}
                setSelectedSchool={setSelectedSchool}
                handleViewSchoolDetails={handleViewSchoolDetails}
              />
            }
            {activeTab === 'metrics' && enabledSections.metrics && <MetricsView />}
            {activeTab === 'timeline' && enabledSections.timeline && <TimelineView />}
            {activeTab === 'issues' && enabledSections.issues && <IssueAnalysisView />}
            {activeTab === 'visits' && enabledSections.visits && 
              <VisitLogView expandedSchoolName={expandedSchoolName} />
            }
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}