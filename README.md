# HVAC Report Template

A configurable and reusable template for creating HVAC service reports based on JSON configuration files.

## Overview

This template allows you to create customized HVAC service reports by simply updating a configuration file, rather than writing code. It's designed to be deployed on Vercel and can be integrated with a backend system for generating reports from user input.

## Features

- **Configurable**: All report content and styling is driven by a JSON configuration file
- **Interactive**: Includes interactive maps, charts, and detailed issue analysis
- **Responsive**: Works on desktop and mobile devices
- **Modular**: Each section can be enabled or disabled via configuration
- **Customizable**: Branding, colors, and layout can be modified via configuration

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-organization/hvac-report-template.git
   cd hvac-report-template
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure your report:
   - Edit the `config/default.json` file with your report data
   - Or create a new configuration file in the `config` directory

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see your report.

### Configuration

The report is entirely driven by a JSON configuration file. A default configuration is provided in `config/default.json`. You can:

- Modify this file directly for a single report
- Create multiple configuration files for different reports
- Generate configuration files programmatically via a backend system

To use a different configuration file, specify it in the URL:
```
http://localhost:3000?config=my-custom-config
```

This will load `config/my-custom-config.json` instead of the default.

## Configuration Structure

The configuration file has the following structure:

```json
{
  "reportInfo": {
    "title": "HVAC Service Report",
    "client": {
      "name": "Client Name",
      "companyName": "Company Name",
      // ...more client details
    },
    "dateRange": {
      "start": "2025-03-01",
      "end": "2025-04-30",
      "display": "March-April 2025"
    }
  },
  "branding": {
    "colors": {
      "primary": "#E83A3A",
      "secondary": "#1D0F5A",
      // ...more colors
    },
    "logo": {
      "url": "https://example.com/logo.png",
      "alt": "Company Logo"
    }
  },
  "data": {
    "locations": [
      // Array of locations/schools
    ],
    "technicians": [
      // Array of technicians
    ],
    "visits": [
      // Array of visits
    ],
    "issues": [
      // Array of issues
    ],
    // ...more data
  },
  "sections": {
    "executive": true,
    "map": true,
    "metrics": true,
    "timeline": true,
    "issues": true,
    "visits": true
  },
  "settings": {
    "mapsApiKey": "YOUR_GOOGLE_MAPS_API_KEY",
    "enableAnalytics": true,
    "defaultTab": "executive"
  }
}
```

See the `config/default.json` file for a complete example.

## Deployment

This project is designed to be deployed on Vercel. To deploy:

1. Push your code to a Git repository
2. Connect the repository to Vercel
3. Configure any environment variables (like API keys)
4. Deploy

## Integration with Backend Systems

This template is designed to work with backend systems that can generate configuration files. The workflow would be:

1. User inputs data through a backend form/wizard
2. Backend generates a JSON configuration file
3. The configuration is passed to this template
4. The template renders the report based on the configuration

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This template was created using Next.js, React, Tailwind CSS, and Recharts
- Maps are powered by Google Maps API
