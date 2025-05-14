# AME HVAC Report Template

This project is a configurable HVAC service report template based on the AME Inc. reporting system. It includes all AME branding elements while allowing for data configuration to create reports for different clients.

## Live Demo
Original AME HVAC Report: [https://ame-hvac-report.vercel.app/](https://ame-hvac-report.vercel.app/)

## Features

- Full AME branding integration
- Configurable client and project data
- Interactive dashboard with multiple views:
  - Executive Summary
  - Geographic Service Map
  - Service Metrics
  - Timeline View
  - Issue Analysis
  - Detailed Visit Logs
- Responsive design for all devices
- Data-driven visualization with charts and graphs

## Setup and Configuration

1. Clone the repository
2. Install dependencies: 
```
npm install
```
3. Copy the .env.example to .env.local and configure as needed
4. Run the development server:
```
npm run dev
```

## Configuration

All report data is configured through `config/default.json`. You can modify this file to:

- Change client information
- Update service metrics
- Add/edit locations and service data
- Customize the issue analysis
- Configure visit logs

## AME Branding

This template includes AME branding elements:

- AME logo (loaded from S3 bucket)
- AME color scheme (red: #E83A3A, navy: #1D0F5A)
- AME styling and design patterns

To use with a different company:

1. Set `forceCustomLogo: true` in the config
2. Update the `logo.url` in the config file
3. Optionally adjust the color scheme in `branding.colors`

## Development

### Folder Structure

- `/components` - UI components organized by section
- `/config` - Configuration files
- `/lib` - Helper functions and context providers
- `/pages` - Next.js pages
- `/public` - Static assets
- `/styles` - Global CSS and styling
- `/utils` - Utility functions

### Adding New Features

To add new sections or features:

1. Create components in the appropriate directory
2. Add to the tab configuration in `lib/tabConfig.js`
3. Enable the section in the config file

### Deployment

This is a Next.js project that can be deployed to Vercel or any other Next.js-compatible hosting service.

```
npm run build
npm start
```

## License

Copyright © 2025 AME Inc. All rights reserved.
