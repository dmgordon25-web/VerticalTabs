import React from 'react';
import { ChromeTab, TabGroup } from '../types';
import { X, Volume2, VolumeX, Pin } from 'lucide-react';

interface TabItemProps {
  tab: ChromeTab;
  isActive: boolean;
  isCollapsed: boolean;
  group?: TabGroup;
  onActivate: (id: number) => void;
  onClose: (id: number, e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent, tab: ChromeTab) => void;
  onDragStart: (e: React.DragEvent, tabId: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  index: number;
}

// Map Chrome group colors to Tailwind/CSS classes
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

const TabItem: React.FC<TabItemProps> = ({ 
  tab, isActive, isCollapsed, group, index,
  onActivate, onClose, onContextMenu, 
  onDragStart, onDragOver, onDrop 
}) => {
  
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose(tab.id, e);
  };

  const favicon = tab.favIconUrl || `https://www.google.com/s2/favicons?domain=${tab.url}&sz=32`;
  const isMuted = tab.mutedInfo?.muted;
  const isAudible = tab.audible;

  return (
    <div
      draggable={!tab.pinned} // Only unpinned tabs are draggable in this simplified implementation
      onDragStart={(e) => onDragStart(e, tab.id)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onContextMenu={(e) => onContextMenu(e, tab)}
      onClick={() => onActivate(tab.id)}
      className={`
        group/tab relative flex items-center h-[40px] rounded-md cursor-default select-none transition-all duration-150 ease-out
        ${isCollapsed ? 'justify-center px-0 mx-1 mb-1' : 'px-3 mx-2 mb-[2px]'}
        ${isActive 
          ? 'bg-edge-surface text-black shadow-card' 
          : 'text-edge-text hover:bg-edge-hover'}
        ${tab.pinned ? 'mb-1' : ''}
      `}
      title={tab.title}
    >
      {/* Group Indicator (Colored line on left) - Enhanced to look like tree structure */}
      {group && !isCollapsed && (
        <div 
          className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-r-sm`}
          style={{ backgroundColor: getGroupColor(group.color) }}
        />
      )}

      {/* Active Indicator (Blue pill) */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[16px] bg-edge-accent rounded-r-full z-10" />
      )}

      {/* Content Container */}
      <div className={`flex items-center w-full ${isCollapsed ? 'justify-center' : ''} ${group && !isCollapsed ? 'ml-2' : ''}`}>
        
        {/* Favicon & Audio Indicator */}
        <div className="relative flex-shrink-0 flex items-center justify-center w-4 h-4">
           {isAudible && !isMuted ? (
             <Volume2 size={14} className="text-edge-text animate-pulse" />
           ) : isMuted ? (
             <VolumeX size={14} className="text-edge-muted" />
           ) : (
             <img 
              src={favicon} 
              alt="" 
              className={`w-4 h-4 object-contain rounded-sm ${!isActive && 'opacity-85'}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📄</text></svg>';
              }} 
            />
           )}
           
           {tab.pinned && (
             <div className="absolute -bottom-2 -right-2 bg-edge-surface rounded-full p-[1px] shadow-sm">
               <Pin size={8} className="text-edge-muted" />
             </div>
           )}
        </div>

        {/* Text Content (Hidden if collapsed) */}
        {!isCollapsed && (
          <div className="ml-3 flex-1 min-w-0 flex flex-col justify-center">
            <span className={`text-[13px] leading-tight truncate ${isActive ? 'font-semibold' : 'font-normal'}`}>
              {tab.title}
            </span>
          </div>
        )}

        {/* Actions */}
        {!isCollapsed && (
          <div className={`ml-2 flex-shrink-0 flex items-center opacity-0 group-hover/tab:opacity-100 transition-opacity duration-200 ${isActive ? 'opacity-100' : ''}`}>
            <button 
              onClick={handleClose}
              className="p-1 rounded-md hover:bg-edge-hover text-edge-muted hover:text-black transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabItem;
