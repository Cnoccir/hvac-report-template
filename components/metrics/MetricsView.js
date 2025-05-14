// components/metrics/MetricsView.js
import React from 'react';
import { 
  LineChart, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Line 
} from 'recharts';
import { useConfig } from '../../lib/ConfigContext';
import SectionTitle from '../ui/SectionTitle';
import SectionSubtitle from '../ui/SectionSubtitle';
import Subheading from '../ui/Subheading';

/**
 * Component for displaying service metrics
 */
const MetricsView = () => {
  // Access configuration context
  const { config } = useConfig();
  
  // Extract necessary data from config
  const { locations, technicians } = config.data;
  const colors = config.branding.colors;
  const dateRange = config.reportInfo.dateRange.display;
  const clientName = config.reportInfo.client.name;
  const monthlyHours = config.metrics.monthly || [];
  
  // Calculate total metrics (or use from config if provided)
  const totalLocations = config.metrics.summary?.locations || locations.length;
  const totalVisits = config.metrics.summary?.visits || 
    locations.reduce((sum, location) => sum + location.visits, 0);
  const totalHours = config.metrics.summary?.hours || 
    locations.reduce((sum, location) => sum + location.hours, 0);
  const totalTechnicians = config.metrics.summary?.technicians || 
    (technicians ? technicians.length : 0);

  return (
    <div>
      <SectionTitle>SERVICE METRICS OVERVIEW</SectionTitle>
      <SectionSubtitle range={dateRange} client={clientName} />

      {/* Summary statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" 
             style={{ borderColor: colors.primary }}>
          <div className="text-3xl font-bold text-black">{totalLocations}</div>
          <div className="text-sm font-medium text-gray-600">Schools Serviced</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" 
             style={{ borderColor: colors.primary }}>
          <div className="text-3xl font-bold text-black">{totalVisits}</div>
          <div className="text-sm font-medium text-gray-600">Total Visits</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" 
             style={{ borderColor: colors.primary }}>
          <div className="text-3xl font-bold text-black">{totalHours}</div>
          <div className="text-sm font-medium text-gray-600">Labor Hours</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4" 
             style={{ borderColor: colors.primary }}>
          <div className="text-3xl font-bold text-black">{totalTechnicians}</div>
          <div className="text-sm font-medium text-gray-600">Technicians</div>
        </div>
      </div>

      {/* Labor hours by school chart */}
      <div className="mb-8">
        <Subheading>Labor Hours by School</Subheading>
        <div className="bg-white p-4 rounded-lg shadow h-64 border border-gray-200">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[...locations].sort((a, b) => b.hours - a.hours)}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={colors.lightGrey} />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{fontSize: 10}} />
              <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value} hours`, 'Service Hours']} />
              <Bar dataKey="hours" fill={colors.primary} name="Service Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly hours comparison */}
      {monthlyHours.length > 0 && (
        <div className="mb-8">
          <Subheading>Monthly Service Hours</Subheading>
          <div className="bg-white p-4 rounded-lg shadow h-64 border border-gray-200">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyHours}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.lightGrey} />
                <XAxis dataKey="month" />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value} hours`, 'Service Hours']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke={colors.primary} 
                  activeDot={{ r: 8 }} 
                  name="Service Hours" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Technician data table */}
      {technicians && technicians.length > 0 && (
        <div className="mb-6">
          <Subheading>Service by Technician</Subheading>
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Technician
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Visits
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Hours
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    % of Total Hours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {technicians.map((tech, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {tech.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {tech.visits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {tech.hours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {Math.round((tech.hours / totalHours) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* School data table */}
      <div>
        <Subheading>Service by School</Subheading>
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  School
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Visits
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locations.map((school, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    {school.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {school.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {school.visits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {school.hours}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetricsView;