// lib/ConfigContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BASE_URLS, DOCUMENTATION } from '../utils/linkConfig';

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
        secondary: "#1D0F5A",
        accent: "#3A6EE8",
        light: "#6AAFE8",
        gray: "#666666",
        lightGrey: "#F2F2F2",
        mediumGrey: "#DDDDDD",
        darkGrey: "#777777"
      },
      logo: {
        url: `${BASE_URLS.IMAGES}/tutor-logo.png`,
        alt: "AME Inc. Logo",
        forceCustomLogo: false
      },
      favicon: DOCUMENTATION.FAVICON
    },
    data: {
      locations: [],
      technicians: [],
      visits: [],
      issues: []
    },
    sections: {
      executive: true,
      map: true,
      metrics: true,
      timeline: true,
      issues: true,
      visits: true
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
  const defaultConfig = {
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
        secondary: "#1D0F5A",
        accent: "#3A6EE8",
        light: "#6AAFE8",
        gray: "#666666",
        lightGrey: "#F2F2F2",
        mediumGrey: "#DDDDDD",
        darkGrey: "#777777"
      },
      logo: {
        url: `${BASE_URLS.IMAGES}/tutor-logo.png`,
        alt: "AME Inc. Logo",
        forceCustomLogo: false
      },
      favicon: DOCUMENTATION.FAVICON
    },
    data: {
      locations: [],
      technicians: [],
      visits: [],
      issues: []
    },
    sections: {
      executive: true,
      map: true,
      metrics: true,
      timeline: true,
      issues: true,
      visits: true
    }
  };
  
  const [state, setState] = useState({
    config: defaultConfig,
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
        
        // Merge with default config to ensure all required fields exist
        const mergedConfig = {
          ...defaultConfig,
          ...data,
          branding: {
            ...defaultConfig.branding,
            ...data.branding,
            colors: {
              ...defaultConfig.branding.colors,
              ...(data.branding?.colors || {}),
            },
            logo: {
              ...defaultConfig.branding.logo,
              ...(data.branding?.logo || {}),
            }
          },
          sections: {
            ...defaultConfig.sections,
            ...(data.sections || {})
          }
        };
        
        setState({
          config: mergedConfig,
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