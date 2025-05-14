// lib/ConfigContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context with a default value
const ConfigContext = createContext({
  config: {
    reportInfo: {
      title: "HVAC Service Report",
      client: {
        name: "Demo Client",
        companyName: "AME Inc."
      },
      dateRange: {
        display: "Demo Period"
      }
    },
    branding: {
      colors: {
        primary: "#E83A3A",
        secondary: "#1D0F5A"
      }
    },
    data: {
      locations: [],
      technicians: [],
      visits: [],
      issues: []
    },
    sections: {
      executive: true,
      metrics: true
    }
  },
  loading: false,
  error: null
});

/**
 * Custom hook to access the configuration
 */
export function useConfig() {
  return useContext(ConfigContext);
}

/**
 * Provider component for configuration
 */
export function ConfigProvider({ children }) {
  const [state, setState] = useState({
    config: {
      reportInfo: {
        title: "HVAC Service Report",
        client: {
          name: "Demo Client",
          companyName: "AME Inc."
        },
        dateRange: {
          display: "Demo Period"
        }
      },
      branding: {
        colors: {
          primary: "#E83A3A",
          secondary: "#1D0F5A"
        }
      },
      data: {
        locations: [],
        technicians: [],
        visits: [],
        issues: []
      },
      sections: {
        executive: true,
        metrics: true
      }
    },
    loading: true,
    error: null
  });

  // Load the configuration when the component mounts
  useEffect(() => {
    // Skip in SSR
    if (typeof window === 'undefined') {
      return;
    }

    let isMounted = true;

    async function loadConfig() {
      try {
        console.log('Fetching configuration...');
        const response = await fetch('/api/config');
        
        if (!isMounted) return;
        
        if (!response.ok) {
          throw new Error(`Failed to load configuration: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Configuration loaded:', data);
        
        if (!isMounted) return;
        
        setState({
          config: data,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error loading configuration:', error);
        
        if (!isMounted) return;
        
        setState(prev => ({
          ...prev,
          loading: false,
          error: error
        }));
      }
    }

    loadConfig();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ConfigContext.Provider value={state}>
      {children}
    </ConfigContext.Provider>
  );
}

export default ConfigProvider;