const env = require('dotenv').config();
const fs = require('fs');
const path = require('path');

module.exports = app => {
  // giving the global variable assetPath to the app
  app.locals.assetPath = function (filePath) {
    // Use NODE_ENV for environment detection in production
    const isDevelopment = process.env.NODE_ENV !== 'production' && process.env.CODEIAL_ENVIRONMENT !== 'production';
    
    if (isDevelopment) {
      return '/' + filePath;
    }

    try {
      // In production, try to read the rev-manifest.json file
      const manifestPath = path.join(__dirname, '../public/assets/rev-manifest.json');
      
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        const hashedFileName = manifest[filePath];
        
        if (hashedFileName) {
          return '/assets/' + hashedFileName;
        }
      }
      
      // Fallback: if manifest doesn't exist or file not found, return original path
      console.warn(`Asset not found in manifest: ${filePath}, using fallback`);
      return '/assets/' + filePath;
      
    } catch (error) {
      console.error('Error reading asset manifest:', error);
      // Fallback to original path
      return '/assets/' + filePath;
    }
  };
};
