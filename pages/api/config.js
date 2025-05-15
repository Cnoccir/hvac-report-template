// pages/api/config.js
import fs from 'fs';
import path from 'path';

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
    locations: [
      {
        id: 1,
        name: "Demo School",
        address: "123 Example St",
        city: "Demo City",
        state: "NY",
        zip: "10001",
        visits: 3,
        hours: 12,
        coordinates: {
          lat: 40.7128,
          lng: -74.006
        },
        technicians: ["John Doe"]
      }
    ],
    technicians: [
      { name: "John Doe", visits: 5, hours: 20 }
    ],
    visits: [
      { date: "2025-03-01", location: "Demo School", tech: "John Doe", hours: 4 }
    ],
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
 * API endpoint that returns configuration
 */
export default function handler(req, res) {
  try {
    // Determine which config file to load
    const configFile = process.env.NEXT_PUBLIC_CONFIG_FILE || 'default';
    const configPath = path.join(process.cwd(), 'config', `${configFile}.json`);
    
    // Check if the file exists
    if (fs.existsSync(configPath)) {
      // Read and parse the config file
      const configData = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configData);
      
      console.log(`Loaded configuration from ${configFile}.json`);
      res.status(200).json(config);
    } else {
      console.warn(`Config file ${configFile}.json not found, using default config`);
      res.status(200).json(defaultConfig);
    }
  } catch (error) {
    console.error('Error loading configuration:', error);
    res.status(200).json(defaultConfig);
  }
}