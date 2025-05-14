// components/executive/ExecutiveSummaryView.js
import React from 'react';
import { useConfig } from '../../lib/ConfigContext';
import SectionTitle from '../ui/SectionTitle';
import SectionSubtitle from '../ui/SectionSubtitle';
import Subheading from '../ui/Subheading';
import AmeLogo from '../ui/AmeLogo';

/**
 * Executive Summary Component
 */
const ExecutiveSummaryView = () => {
  const { config } = useConfig();
  const clientName = config.reportInfo.client.name;
  const companyName = config.reportInfo.client.companyName;
  const dateRange = config.reportInfo.dateRange.display;
  const generateDate = config.reportInfo.generateDate;
  const keyFindings = config.data.executiveSummary?.keyFindings || [];
  const recommendations = config.data.executiveSummary?.recommendations || [];
  const criticalIssues = config.data.executiveSummary?.criticalIssues || [];
  const colors = config.branding.colors;
  
  // Extract metrics data
  const totalLocations = config.metrics?.summary?.locations || 0;
  const totalVisits = config.metrics?.summary?.visits || 0;
  const totalHours = config.metrics?.summary?.hours || 0;
  const totalTechnicians = config.metrics?.summary?.technicians || 0;
  
  return (
    <div>
      <div className="text-center mb-6">
        <AmeLogo size="large" />
        <div className="mt-4">
          <SectionTitle>EXECUTIVE SUMMARY</SectionTitle>
          <SectionSubtitle />
        </div>
      </div>

      {/* Company info and header information */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-base font-bold text-black">{companyName}</div>
          <div className="text-sm text-gray-600">{config.reportInfo.client.companyAddress?.line1}</div>
          <div className="text-sm text-gray-600">
            {config.reportInfo.client.companyAddress?.city}, {config.reportInfo.client.companyAddress?.state} {config.reportInfo.client.companyAddress?.zip}
          </div>
          <div className="text-sm text-gray-600">Tel: {config.reportInfo.client.companyPhone}</div>
        </div>
        <div className="bg-gray-100 p-3 rounded border-l-4" style={{ borderColor: colors.primary }}>
          <div className="text-xl font-bold text-black">HVAC SERVICE REPORT</div>
          <div className="text-sm text-gray-600">Generated: {generateDate}</div>
        </div>
      </div>

      {/* Summary statistics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" style={{ borderColor: colors.primary }}>
          <div className="text-3xl font-bold text-black">{totalLocations}</div>
          <div className="text-sm font-medium text-gray-600">Schools</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" style={{ borderColor: colors.primary }}>
          <div className="text-3xl font-bold text-black">{totalVisits}</div>
          <div className="text-sm font-medium text-gray-600">Visits</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" style={{ borderColor: colors.primary }}>
          <div className="text-3xl font-bold text-black">{totalHours}</div>
          <div className="text-sm font-medium text-gray-600">Hours</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" style={{ borderColor: colors.primary }}>
          <div className="text-3xl font-bold text-black">{totalTechnicians}</div>
          <div className="text-sm font-medium text-gray-600">Technicians</div>
        </div>
      </div>

      {/* Summary text */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
        <p className="mb-4 text-black">
          Between {dateRange}, {companyName} conducted <strong>{totalVisits} maintenance visits</strong> across {totalLocations} {clientName} facilities, totaling <strong>{totalHours} labor hours</strong>. This bi-weekly maintenance program has provided consistent monitoring, troubleshooting, and seasonal transition services for the district's HVAC systems.
        </p>

        <div className="mb-4">
          <h4 className="font-bold mb-2 text-black">Key Findings</h4>
          <ul className="list-disc pl-5 space-y-1 text-black">
            {keyFindings.map((finding, index) => (
              <li key={index}>{finding}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-2 text-black">Recommendations</h4>
          <p className="mb-2 text-black">Based on these observations, we recommend:</p>
          <ul className="list-disc pl-5 space-y-1 text-black">
            {recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Critical issues */}
      {criticalIssues.length > 0 && (
        <div>
          <Subheading>Critical Issues Requiring Follow-up</Subheading>
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Issue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Schools Affected
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Recommendation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {criticalIssues.map((issue, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {issue.issue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        issue.priority === 'High' ? 'bg-red-100 text-red-800' : 
                        issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {issue.schoolsAffected}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {issue.recommendation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveSummaryView;