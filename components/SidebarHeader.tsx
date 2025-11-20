import React from 'react';
import { Search, SidebarOpen, SidebarClose, Plus, LayoutGrid } from 'lucide-react';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNewTab: () => void;
  onToggleRecent: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ 
  isCollapsed, 
  onToggleCollapse,
  searchQuery,
  onSearchChange,
  onNewTab,
  onToggleRecent
}) => {
  return (
    <div className="flex flex-col flex-shrink-0 pt-2 pb-2 bg-edge-bg z-10">
      {/* Top Row: Toggle & Actions */}
      <div className={`flex items-center mb-2 px-2 ${isCollapsed ? 'flex-col gap-2 justify-center' : 'justify-between'}`}>
        
        {/* Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="p-2 text-edge-text hover:bg-edge-hover rounded-md transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <SidebarOpen size={20} /> : <SidebarClose size={20} />}
        </button>

        {/* Action Buttons */}
        <div className={`flex items-center gap-1 ${isCollapsed ? 'flex-col' : ''}`}>
           {!isCollapsed && (
             <button 
              onClick={onToggleRecent}
              className="p-2 text-edge-text hover:bg-edge-hover rounded-md transition-colors" 
              title="Recently closed tabs"
             >
               <LayoutGrid size={18} />
             </button>
           )}
           
           <button
            onClick={onNewTab}
            className={`
              flex items-center justify-center rounded-md bg-edge-surface shadow-sm border border-edge-border text-edge-text hover:bg-edge-hover transition-colors
              ${isCollapsed ? 'p-2 mt-2' : 'px-3 py-1.5 text-xs font-semibold ml-1'}
            `}
            title="New Tab"
          >
            <Plus size={18} />
            {!isCollapsed && <span className="ml-1">New tab</span>}
          </button>
        </div>
      </div>

      {/* Search Bar (Only when expanded) */}
      {!isCollapsed && (
        <div className="px-3 mt-1 mb-2">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Search size={14} className="text-edge-muted group-focus-within:text-edge-accent" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tabs"
              className="
                w-full py-1.5 pl-8 pr-3 
                bg-edge-surface border border-edge-border focus:border-edge-accent/50
                rounded-md text-sm text-edge-text placeholder-edge-muted
                focus:outline-none focus:ring-1 focus:ring-edge-accent/50
                transition-all
              "
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
