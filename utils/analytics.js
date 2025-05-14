// utils/analytics.js
/**
 * Analytics utility functions for tracking user interactions
 */

/**
 * Track when a user changes tabs
 * @param {string} tabId - The ID of the tab that was clicked
 */
export const trackTabChange = (tabId) => {
  // In a real implementation, this would send data to an analytics service
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'tab_change', {
        'event_category': 'navigation',
        'event_label': tabId
      });
    }
    
    console.log(`Analytics: Tab changed to ${tabId}`);
  } catch (error) {
    console.error('Error tracking tab change:', error);
  }
};

/**
 * Track when a user selects a school on the map
 * @param {string} schoolName - The name of the school that was selected
 * @param {number} schoolId - The ID of the school that was selected
 */
export const trackSchoolSelection = (schoolName, schoolId) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'school_selection', {
        'event_category': 'map_interaction',
        'event_label': schoolName,
        'school_id': schoolId
      });
    }
    
    console.log(`Analytics: School selected: ${schoolName} (ID: ${schoolId})`);
  } catch (error) {
    console.error('Error tracking school selection:', error);
  }
};

/**
 * Track when a user views a service report
 * @param {string} reportId - The ID of the report that was viewed
 * @param {string} schoolName - The name of the school the report is for
 */
export const trackReportView = (reportId, schoolName) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'report_view', {
        'event_category': 'document_interaction',
        'event_label': reportId,
        'school_name': schoolName
      });
    }
    
    console.log(`Analytics: Report viewed: ${reportId} for ${schoolName}`);
  } catch (error) {
    console.error('Error tracking report view:', error);
  }
};

/**
 * Track when a user views an issue detail
 * @param {string} issueId - The ID of the issue
 * @param {string} issueName - The name/title of the issue
 */
export const trackIssueView = (issueId, issueName) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'issue_view', {
        'event_category': 'issue_interaction',
        'event_label': issueName,
        'issue_id': issueId
      });
    }
    
    console.log(`Analytics: Issue viewed: ${issueName} (ID: ${issueId})`);
  } catch (error) {
    console.error('Error tracking issue view:', error);
  }
};

/**
 * Initialize analytics
 * @param {string} analyticsId - The Google Analytics measurement ID
 */
export const initAnalytics = (analyticsId) => {
  if (typeof window !== 'undefined' && analyticsId) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    script.async = true;
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments);}
    window.gtag('js', new Date());
    window.gtag('config', analyticsId);
    
    console.log('Analytics initialized with ID:', analyticsId);
  }
};

export default {
  trackTabChange,
  trackSchoolSelection,
  trackReportView,
  trackIssueView,
  initAnalytics
};