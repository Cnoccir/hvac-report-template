# HVAC Report Configuration Guide

This guide explains how to customize the HVAC Service Report by editing configuration files.

## Configuration Process

1. **Create a new configuration file**
   - Create a JSON file in the `config` directory (e.g., `yourcompany.json`)
   - You can copy `default.json` as a starting template

2. **Set environment variable to use your config**
   - Update `.env.local` to use your config:
   ```
   NEXT_PUBLIC_CONFIG_FILE=yourcompany
   ```

3. **Start the development server**
   ```
   npm run dev
   ```

## Configuration Options

### Basic Information

```json
{
  "reportInfo": {
    "title": "HVAC Service Report",
    "client": {
      "name": "Client School District", 
      "companyName": "AME Inc.",
      "companyAddress": {
        "line1": "1275 Bloomfield Ave., Building 2 Suite 17B",
        "city": "Fairfield",
        "state": "NJ",
        "zip": "07004"
      },
      "companyPhone": "(973) 884-4100"
    },
    "dateRange": {
      "start": "2025-03-01",
      "end": "2025-04-30",
      "display": "March-April 2025"
    },
    "generateDate": "2025-05-08"
  }
}
```

### Locations

Add each school or service location:

```json
"locations": [
  {
    "id": 1,
    "name": "School Name",
    "address": "123 School Street",
    "city": "Cityname",
    "state": "NY",
    "zip": "10001",
    "visits": 3,
    "hours": 12,
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.006
    },
    "technicians": ["Technician Name"],
    "imageUrl": "https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/school-placeholder.jpg"
  }
]
```

### Technicians

Define technicians who performed the service:

```json
"technicians": [
  { "name": "Technician Name", "visits": 5, "hours": 20 }
]
```

### Visits

Log each service visit:

```json
"visits": [
  { 
    "date": "2025-03-01", 
    "location": "School Name", 
    "tech": "Technician Name", 
    "hours": 4 
  }
]
```

### Issues

Document HVAC issues found:

```json
"issues": [
  {
    "id": 1,
    "name": "Issue Name",
    "priority": "High", // High, Medium, or Low
    "frequency": "27%",
    "schools": 3,
    "description": "Description of the issue",
    "recommendation": "Recommendation for fixing the issue",
    "type": "connectivity", // connectivity, heating, cooling, etc.
    "impact": "Which schools are affected",
    "affectedEquipment": [
      "Equipment 1",
      "Equipment 2"
    ]
  }
]
```

### Visit Logs

Add detailed service logs for each location:

```json
"visitLogs": {
  "School Name": [
    {
      "date": "March 3, 2025",
      "technician": "Technician Name",
      "duration": "8.00 hours",
      "summary": [
        "First work item completed",
        "Second work item completed",
        "Third work item completed"
      ]
    }
  ]
}
```

### Summary Metrics

Provide summary statistics:

```json
"metrics": {
  "summary": {
    "locations": 3,
    "visits": 12,
    "hours": 52,
    "technicians": 3
  },
  "monthly": [
    { "month": "March", "hours": 30 },
    { "month": "April", "hours": 22 }
  ],
  "calendar": [
    { 
      "month": "March", 
      "weeks": {
        "Week 1 (3/1-3/7)": 12,
        "Week 2 (3/8-3/14)": 0,
        "Week 3 (3/15-3/21)": 8,
        "Week 4 (3/22-3/31)": 10
      }
    }
  ]
}
```

### Map Settings

Configure the map display:

```json
"settings": {
  "mapCenter": {
    "lat": 40.718,
    "lng": -74.213
  },
  "mapZoom": 14
}
```

## Advanced Configuration

### Custom Branding

To use a different logo:

```json
"branding": {
  "logo": {
    "url": "https://your-website.com/your-logo.png",
    "alt": "Your Company Logo",
    "forceCustomLogo": true
  }
}
```

### Custom Colors

To modify the color scheme:

```json
"branding": {
  "colors": {
    "primary": "#E83A3A",
    "secondary": "#1D0F5A",
    "accent": "#3A6EE8"
  }
}
```

### Enabling/Disabling Sections

Control which sections appear in the report:

```json
"sections": {
  "executive": true,
  "map": true,
  "metrics": true,
  "timeline": true,
  "issues": true,
  "visits": true
}
```

## Validation

The system will validate your configuration and provide error messages if there are issues. Common validation errors include:

- Missing required fields
- Invalid location references in visits
- Invalid technician references
- Incorrect date formats

If you see validation errors, check your configuration file carefully.
