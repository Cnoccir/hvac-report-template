// pages/index.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Menu, X } from 'lucide-react';
import { useConfig } from '../lib/ConfigContext';
import { trackTabChange } from '../utils/analytics';

// Import components 
import AmeLogo from '../components/ui/AmeLogo';
import ExecutiveSummaryView from '../components/executive/ExecutiveSummaryView';
import MapView from '../components/maps/MapView';
import MetricsView from '../components/metrics/MetricsView';
import TimelineView from '../components/timeline/TimelineView';
import IssueAnalysisView from '../components/issues/IssueAnalysisView';
import VisitLogView from '../components/visits/VisitLogView';
import Footer from '../components/ui/Footer';

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

  // Generate the page title
  const pageTitle = `${client.companyName} - ${client.name} ${title}`;

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