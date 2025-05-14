// pages/api/config.js
import path from 'path';
import fs from 'fs/promises';
import { validateConfig } from '../../lib/configValidator';

// Default config if file can't be loaded
const defaultConfig = {
  reportInfo: {
    title: "HVAC Service Report",
    client: {
      name: "Demo Client",
      companyName: "AME Inc.",
      companyAddress: {
        line1: "1275 Bloomfield Ave., Building 2 Suite 17B",
        city: "Fairfield",
        state: "NJ",
        zip: "07004"
      },
      companyPhone: "(973) 884-4100"
    },
    dateRange: {
      start: "2025-03-01",
      end: "2025-04-30",
      display: "March-April 2025"
    },
    generateDate: "2025-05-08"
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
      url: "/images/company-logo.svg",
      alt: "AME Inc. Logo"
    },
    favicon: "/favicon.ico"
  },
  baseUrls: {
    images: "/images",
    reports: "/reports",
    docs: "/docs"
  },
  data: {
    locations: [],
    technicians: [],
    visits: [],
    issues: [],
    schoolIssueData: [],
    visitLogs: {}
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
    mapsApiKey: "",
    enableAnalytics: false,
    defaultTab: "executive"
  }
};

/**
 * API endpoint that loads and returns the configuration file
 * 
 * This endpoint:
 * 1. Attempts to load the specified config file
 * 2. Validates the configuration
 * 3. Returns the validated configuration
 */
export default async function handler(req, res) {
  try {
    // Get the config filename from query parameters or use default
    const configName = req.query.config || 'default';
    
    // Ensure no path traversal by sanitizing the config name
    const sanitizedName = path.basename(configName).replace(/[^a-zA-Z0-9\-_]/g, '');
    
    // Construct the path to the config file
    const configPath = path.join(process.cwd(), 'config', `${sanitizedName}.json`);
    
    let configData;
    let config = defaultConfig;
    
    try {
      // Read the config file
      configData = await fs.readFile(configPath, 'utf8');
      
      // Parse the JSON
      const loadedConfig = JSON.parse(configData);
      
      // Merge with default config to ensure required fields
      config = {
        ...defaultConfig,
        ...loadedConfig,
        // Ensure nested objects are also merged
        branding: {
          ...defaultConfig.branding,
          ...loadedConfig.branding
        },
        data: {
          ...defaultConfig.data,
          ...loadedConfig.data
        },
        sections: {
          ...defaultConfig.sections,
          ...loadedConfig.sections
        },
        settings: {
          ...defaultConfig.settings,
          ...loadedConfig.settings
        }
      };
      
    } catch (fileError) {
      console.warn(`Error loading config file ${configPath}: ${fileError.message}. Using default config.`);
      // Continue with default config
    }
    
    // Validate the configuration (this function would be defined in /lib/configValidator.js)
    const { valid, errors } = validateConfig(config);
    
    if (!valid) {
      console.warn(`Invalid configuration: ${errors.join(', ')}. Using default config.`);
      // We'll return the config anyway with a warning header
      res.setHeader('X-Config-Warning', 'Configuration validation failed');
    }
    
    // Return the configuration
    res.status(200).json(config);
  } catch (error) {
    console.error('Error processing configuration:', error);
    
    // Always return something usable
    res.status(200).json(defaultConfig);
  }
}