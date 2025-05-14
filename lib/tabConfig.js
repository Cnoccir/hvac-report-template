// lib/tabConfig.js
import { 
  FileText, 
  Map, 
  BarChart2, 
  Calendar, 
  AlertTriangle, 
  Clock 
} from 'lucide-react';

/**
 * Configuration for the main navigation tabs
 */
export const tabConfig = [
  { 
    id: 'executive', 
    label: 'Executive Summary', 
    icon: <FileText size={16} /> 
  },
  { 
    id: 'map', 
    label: 'Service Map', 
    icon: <Map size={16} /> 
  },
  { 
    id: 'metrics', 
    label: 'Service Metrics', 
    icon: <BarChart2 size={16} /> 
  },
  { 
    id: 'timeline', 
    label: 'Timeline', 
    icon: <Calendar size={16} /> 
  },
  { 
    id: 'issues', 
    label: 'Issue Analysis', 
    icon: <AlertTriangle size={16} /> 
  },
  { 
    id: 'visits', 
    label: 'Visit Logs', 
    icon: <Clock size={16} /> 
  }
];

export default tabConfig;