/**
 * AME Inc. Link Configuration
 * This file centralizes all external links and file paths used in the application
 */

// Base URLs for different asset types
const BASE_URLS = {
  IMAGES: 'https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images',
  REPORTS: 'https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/service-reports',
  DOCS: 'https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/documentation'
};

// School images mapping
const SCHOOL_IMAGES = {
  "Clifton High School": `${BASE_URLS.IMAGES}/CliftonHS.png`,
  "Clifton Stadium Weight Room": `${BASE_URLS.IMAGES}/Clifton+Stadium+Weight+Room.png`,
  "Clifton Public School #1": `${BASE_URLS.IMAGES}/CliftonPS1.png`,
  "Clifton Public School #3": `${BASE_URLS.IMAGES}/CliftonPS3.png`,
  "Clifton Public School #4": `${BASE_URLS.IMAGES}/CliftonPS4.png`,
  "Clifton Public School #5": `${BASE_URLS.IMAGES}/CliftonPS5.png`,
  "Clifton Public School #9": `${BASE_URLS.IMAGES}/CliftonPS9.png`,
  "Clifton Public School #11": `${BASE_URLS.IMAGES}/CliftonPS11.png`,
  "Clifton Public School #14": `${BASE_URLS.IMAGES}/CliftonPS14.png`,
  "Clifton School #17": `${BASE_URLS.IMAGES}/CliftonPS17.png`,
  "Clifton Early Learner Academy": `${BASE_URLS.IMAGES}/CliftonELA.png`
};

// Service report PDFs mapping by job number
const SERVICE_REPORTS = {
  // Clifton School #17 Reports
  "211664-13788": `${BASE_URLS.REPORTS}/211664-13788-PS17.pdf`,
  
  // Clifton Early Learner Academy Reports
  "210965-12939": `${BASE_URLS.REPORTS}/210965-12939-ELA.pdf`,
  "210972-12946": `${BASE_URLS.REPORTS}/210972-12946-ELA.pdf`,
  
  // Clifton High School Reports
  "210966-12940": `${BASE_URLS.REPORTS}/210966-12940-CHS.pdf`,
  "210955-12929": `${BASE_URLS.REPORTS}/210955-12929-CHS.pdf`,
  "210973-12947": `${BASE_URLS.REPORTS}/210973-12947-CHS.pdf`
};

// Other document links
const DOCUMENTATION = {
  AME_LOGO: `${BASE_URLS.IMAGES}/tutor-logo.png`,
  FAVICON: `${BASE_URLS.IMAGES}/favicon.ico`,
  SYSTEM_MANUAL: `${BASE_URLS.DOCS}/ame-system-manual.pdf`,
  MAINTENANCE_GUIDE: `${BASE_URLS.DOCS}/ame-maintenance-guide.pdf`
};

// Export all configurations
export { 
  BASE_URLS,
  SCHOOL_IMAGES,
  SERVICE_REPORTS,
  DOCUMENTATION
};
