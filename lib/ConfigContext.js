// lib/ConfigContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for storing the configuration data
const ConfigContext = createContext(null);

// Default configuration to use while loading
const defaultConfig = {
  reportInfo: {
    title: "HVAC Service Report",
    client: {
      name: "Loading...",
      companyName: "Loading...",
      companyAddress: {
        line1: "",
        city: "",
        state: "",
        zip: ""
      },
      companyPhone: ""
    },
    dateRange: {
      start: "",
      end: "",
      display: "Loading..."
    },
    generateDate: ""
  },
  branding: {
    colors: {
      primary: "#E83A3A",
      secondary: "#1D0F5A",
      accent: "#3A6EE8",
      light: "#6AAFE8",
      gray: "#666666",
      text: "#000000",
      lightGrey: "#F2F2F2",
      mediumGrey: "#DDDDDD",
      darkGrey: "#777777"
    },
    logo: {
      url: "",
      alt: "Logo"
    },
    favicon: ""
  },
  data: {
    locations: [],
    technicians: [],
    visits: [],
    issues: [],
    schoolIssueData: [],
    visitLogs: {}
  },
  metrics: {
    summary: {
      locations: 0,
      visits: 0,
      hours: 0,
      technicians: 0
    },
    monthly: [],
    calendar: []
  },
  sections: {
    executive: true,
    map: true,
    metrics: true,
    timeline: true,
    issues: true,
    visits: true
  },
  settings: {
    enableAnalytics: false,
    defaultTab: "executive",
  }
};

/**
 * Custom hook to access the configuration throughout the application
 */
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

/**
 * Provider component that makes configuration data available to all child components
 */
export const ConfigProvider = ({ children, initialConfig = null }) => {
  const [config, setConfig] = useState(initialConfig || defaultConfig);
  const [loading, setLoading] = useState(initialConfig ? false : true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip loading if initial config is provided
    if (initialConfig) {
      return;
    }

    // Don't fetch in SSR
    if (typeof window === 'undefined') {
      return;
    }

    const fetchConfig = async () => {
      try {
        // Fetch configuration from API endpoint
        const response = await fetch('/api/config');
        
        if (!response.ok) {
          throw new Error(`Failed to load configuration: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Merge with default config to ensure all fields exist
        const mergedConfig = {
          ...defaultConfig,
          ...data,
          branding: {
            ...defaultConfig.branding,
            ...data.branding
          },
          data: {
            ...defaultConfig.data,
            ...data.data
          },
          metrics: {
            ...defaultConfig.metrics,
            ...data.metrics
          },
          sections: {
            ...defaultConfig.sections,
            ...data.sections
          },
          settings: {
            ...defaultConfig.settings,
            ...data.settings
          }
        };
        
        setConfig(mergedConfig);
        setLoading(false);
      } catch (err) {
        console.error('Error loading configuration:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchConfig();
  }, [initialConfig]);

  // Create a function to update specific parts of the configuration
  const updateConfig = (path, value) => {
    setConfig(prevConfig => {
      // Deep clone the previous config to avoid mutations
      const newConfig = JSON.parse(JSON.stringify(prevConfig));
      
      // Split the path into segments (e.g., 'branding.colors.primary' -> ['branding', 'colors', 'primary'])
      const pathArray = path.split('.');
      let current = newConfig;
      
      // Navigate through the path except the last segment
      for (let i = 0; i < pathArray.length - 1; i++) {
        // Create the object if it doesn't exist
        if (!current[pathArray[i]]) {
          current[pathArray[i]] = {};
        }
        current = current[pathArray[i]];
      }
      
      // Set the value at the last segment
      const lastKey = pathArray[pathArray.length - 1];
      current[lastKey] = value;
      
      return newConfig;
    });
  };

  // Calculate derived values from the configuration
  const getComputedConfig = () => {
    if (!config) return defaultConfig;

    // Add any computed values here
    const computedConfig = { ...config };
    
    // Set Maps API key from environment if not in config
    if (typeof window !== 'undefined' && 
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && 
        (!computedConfig.settings?.mapsApiKey || 
         computedConfig.settings.mapsApiKey === 'YOUR_GOOGLE_MAPS_API_KEY')) {
      computedConfig.settings = computedConfig.settings || {};
      computedConfig.settings.mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    }
    
    // Calculate total hours
    if (computedConfig.data?.technicians) {
      computedConfig.metrics = computedConfig.metrics || {};
      computedConfig.metrics.totalHours = computedConfig.data.technicians.reduce(
        (sum, tech) => sum + tech.hours, 
        0
      );
    }

    // Calculate total visits
    if (computedConfig.data?.visits) {
      computedConfig.metrics = computedConfig.metrics || {};
      computedConfig.metrics.totalVisits = computedConfig.data.visits.length;
    }

    // Compute full image URLs
    if (computedConfig.data?.locations && computedConfig.baseUrls?.images) {
      computedConfig.data.locations = computedConfig.data.locations.map(location => ({
        ...location,
        fullImageUrl: location.imageUrl ? 
          `${computedConfig.baseUrls.images}/${location.imageUrl}` : 
          null
      }));
    }

    // Compute full report URLs
    if (computedConfig.data?.serviceReports && computedConfig.baseUrls?.reports) {
      const fullReportUrls = {};
      Object.entries(computedConfig.data.serviceReports).forEach(([id, path]) => {
        fullReportUrls[id] = `${computedConfig.baseUrls.reports}/${path}`;
      });
      computedConfig.computedReportUrls = fullReportUrls;
    }

    return computedConfig;
  };

  // Create a loading UI
  if (loading) {
    return (
      <ConfigContext.Provider value={{ 
        config: defaultConfig,
        updateConfig,
        loading: true,
        error: null
      }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p>Loading configuration...</p>
          </div>
        </div>
      </ConfigContext.Provider>
    );
  }

  // Create an error UI
  if (error) {
    return (
      <ConfigContext.Provider value={{ 
        config: defaultConfig,
        updateConfig,
        loading: false,
        error: error
      }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-red-50 p-6 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Configuration Error</h2>
            <p className="text-red-600 mb-4">{error.message}</p>
            <p className="text-gray-700">Please check your configuration file and try again.</p>
          </div>
        </div>
      </ConfigContext.Provider>
    );
  }

  const computedConfig = getComputedConfig();

  // Provide both the raw config and update function
  return (
    <ConfigContext.Provider 
      value={{ 
        config: computedConfig,
        updateConfig,
        loading: false,
        error: null
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;