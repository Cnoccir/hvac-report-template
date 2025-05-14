// pages/api/config.js
import path from 'path';
import fs from 'fs/promises';
import { validateConfig } from '../../lib/configValidator';

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
    
    // Read the config file
    const configData = await fs.readFile(configPath, 'utf8');
    
    // Parse the JSON
    const config = JSON.parse(configData);
    
    // Validate the configuration (this function would be defined in /lib/configValidator.js)
    const { valid, errors } = validateConfig(config);
    
    if (!valid) {
      return res.status(400).json({ 
        error: 'Invalid configuration', 
        details: errors 
      });
    }
    
    // Return the configuration
    res.status(200).json(config);
  } catch (error) {
    console.error('Error loading configuration:', error);
    
    // Check if the error is a file not found error
    if (error.code === 'ENOENT') {
      return res.status(404).json({ 
        error: 'Configuration file not found',
        message: 'The requested configuration file does not exist.'
      });
    }
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return res.status(400).json({ 
        error: 'Invalid JSON',
        message: 'The configuration file contains invalid JSON.' 
      });
    }
    
    // Handle other errors
    res.status(500).json({ 
      error: 'Server error',
      message: 'An error occurred while loading the configuration.' 
    });
  }
}