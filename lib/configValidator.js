// lib/configValidator.js

/**
 * Validates a configuration object against expected schema
 * @param {Object} config - The configuration object to validate
 * @returns {Object} Object with validation results
 */
export function validateConfig(config) {
  // Initialize an array to collect validation errors
  const errors = [];

  // Check if the config is an object
  if (!config || typeof config !== 'object') {
    return {
      valid: false,
      errors: ['Configuration must be a valid JSON object']
    };
  }

  // Required top-level properties
  const requiredProps = ['reportInfo', 'branding', 'data', 'sections'];
  requiredProps.forEach(prop => {
    if (!config[prop]) {
      errors.push(`Missing required property: ${prop}`);
    }
  });

  // Validate reportInfo
  if (config.reportInfo) {
    if (!config.reportInfo.title) {
      errors.push('reportInfo.title is required');
    }
    
    if (!config.reportInfo.client) {
      errors.push('reportInfo.client is required');
    } else {
      if (!config.reportInfo.client.name) {
        errors.push('reportInfo.client.name is required');
      }
    }
    
    if (!config.reportInfo.dateRange) {
      errors.push('reportInfo.dateRange is required');
    } else {
      ['start', 'end', 'display'].forEach(dateProp => {
        if (!config.reportInfo.dateRange[dateProp]) {
          errors.push(`reportInfo.dateRange.${dateProp} is required`);
        }
      });
    }
  }

  // Validate branding
  if (config.branding) {
    if (!config.branding.colors) {
      errors.push('branding.colors is required');
    } else {
      ['primary', 'secondary'].forEach(colorProp => {
        if (!config.branding.colors[colorProp]) {
          errors.push(`branding.colors.${colorProp} is required`);
        }
      });
    }
  }

  // Validate data
  if (config.data) {
    // Validate locations
    if (!config.data.locations || !Array.isArray(config.data.locations) || config.data.locations.length === 0) {
      errors.push('data.locations must be a non-empty array');
    } else {
      // Validate each location
      config.data.locations.forEach((location, index) => {
        if (!location.id) {
          errors.push(`data.locations[${index}].id is required`);
        }
        if (!location.name) {
          errors.push(`data.locations[${index}].name is required`);
        }
        if (!location.coordinates || typeof location.coordinates.lat !== 'number' || typeof location.coordinates.lng !== 'number') {
          errors.push(`data.locations[${index}].coordinates must contain valid lat and lng numbers`);
        }
      });
    }

    // Validate issues (if present)
    if (config.data.issues && (!Array.isArray(config.data.issues) || config.data.issues.length === 0)) {
      errors.push('data.issues (if provided) must be a non-empty array');
    }

    // Validate visits (if present)
    if (config.data.visits && (!Array.isArray(config.data.visits) || config.data.visits.length === 0)) {
      errors.push('data.visits (if provided) must be a non-empty array');
    }

    // Validate technicians (if present)
    if (config.data.technicians && (!Array.isArray(config.data.technicians) || config.data.technicians.length === 0)) {
      errors.push('data.technicians (if provided) must be a non-empty array');
    }
  }

  // Validate sections
  if (config.sections) {
    // Ensure at least one section is enabled
    const hasSections = Object.values(config.sections).some(value => Boolean(value));
    if (!hasSections) {
      errors.push('At least one section must be enabled in sections');
    }
  }

  // Validate baseUrls (if present)
  if (config.baseUrls) {
    const urlProps = ['images', 'reports', 'docs'];
    urlProps.forEach(prop => {
      if (config.baseUrls[prop] && typeof config.baseUrls[prop] !== 'string') {
        errors.push(`baseUrls.${prop} (if provided) must be a string`);
      }
    });
  }

  // Validate settings (if present)
  if (config.settings) {
    if (config.settings.mapsApiKey && typeof config.settings.mapsApiKey !== 'string') {
      errors.push('settings.mapsApiKey (if provided) must be a string');
    }
    
    if (config.settings.defaultTab && typeof config.settings.defaultTab !== 'string') {
      errors.push('settings.defaultTab (if provided) must be a string');
    }
    
    if (config.settings.enableAnalytics !== undefined && typeof config.settings.enableAnalytics !== 'boolean') {
      errors.push('settings.enableAnalytics (if provided) must be a boolean');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates configuration and provides helpful messages
 * @param {Object} config - The configuration object to validate
 * @returns {Object} An object with validation results and friendly messages
 */
export function getConfigValidationStatus(config) {
  const result = validateConfig(config);
  
  if (result.valid) {
    return {
      status: 'success',
      message: 'Configuration is valid',
      details: null
    };
  }
  
  // Group errors by category for better error presentation
  const errorCategories = {
    reportInfo: [],
    branding: [],
    data: [],
    sections: [],
    baseUrls: [],
    settings: [],
    other: []
  };
  
  result.errors.forEach(error => {
    // Determine category based on the error message
    if (error.startsWith('reportInfo')) {
      errorCategories.reportInfo.push(error);
    } else if (error.startsWith('branding')) {
      errorCategories.branding.push(error);
    } else if (error.startsWith('data')) {
      errorCategories.data.push(error);
    } else if (error.startsWith('sections')) {
      errorCategories.sections.push(error);
    } else if (error.startsWith('baseUrls')) {
      errorCategories.baseUrls.push(error);
    } else if (error.startsWith('settings')) {
      errorCategories.settings.push(error);
    } else {
      errorCategories.other.push(error);
    }
  });
  
  return {
    status: 'error',
    message: 'Configuration is invalid',
    details: errorCategories
  };
}

export default { validateConfig, getConfigValidationStatus };