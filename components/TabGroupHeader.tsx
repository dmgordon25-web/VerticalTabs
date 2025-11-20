import React from 'react';
import { TabGroup } from '../types';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TabGroupHeaderProps {
  group: TabGroup;
  isCollapsed: boolean;
  onToggle: () => void;
}

// Map Chrome group colors to CSS colors
const getGroupColor = (colorName: string) => {
  const colors: Record<string, string> = {
    grey: '#5f6368',
    blue: '#1a73e8',
    red: '#d93025',
    yellow: '#f9ab00',
    green: '#188038',
    pink: '#e52592',
    purple: '#9334e6',
    cyan: '#12b5cb',
    orange: '#fa903e',
  };
  return colors[colorName] || '#ccc';
};

const TabGroupHeader: React.FC<TabGroupHeaderProps> = ({ group, isCollapsed, onToggle }) => {
  const color = getGroupColor(group.color);
  
  if (isCollapsed) {
    // Condensed view for sidebar collapsed state - just a dot or line
    return (
      <div className="flex justify-center py-2 cursor-pointer" onClick={onToggle} title={group.title}>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      </div>
    );
  }

  return (
    <div 
      onClick={onToggle}
      className="flex items-center px-2 py-1.5 mx-2 my-1 cursor-pointer hover:bg-edge-hover rounded-md select-none group/header transition-colors"
    >
      <div className="mr-1 text-edge-muted">
        {group.collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
      </div>
      
      <div 
        className="w-3 h-3 rounded-full mr-2" 
        style={{ backgroundColor: color }} 
      />
      
      <span className="text-xs font-semibold text-edge-text uppercase tracking-wide truncate flex-1">
        {group.title}
      </span>
    </div>
  );
};

export default TabGroupHeader;
