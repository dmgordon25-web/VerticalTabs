import React, { useEffect, useRef } from 'react';
import { ChromeTab } from '../types';
import { X, Pin, Volume2, VolumeX, ExternalLink, Copy, Columns } from 'lucide-react';

interface ContextMenuProps {
  position: { x: number; y: number };
  tab: ChromeTab;
  onClose: () => void;
  onAction: (action: string, tab: ChromeTab) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ position, tab, onClose, onAction }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Adjust position to not go off screen
  const style: React.CSSProperties = {
    top: Math.min(position.y, window.innerHeight - 250),
    left: Math.min(position.x, window.innerWidth - 200),
  };

  const MenuItem = ({ icon: Icon, label, action, danger = false }: any) => (
    <button
      onClick={() => onAction(action, tab)}
      className={`w-full flex items-center px-4 py-2 text-sm text-left hover:bg-edge-hover transition-colors
        ${danger ? 'text-red-600' : 'text-edge-text'}
      `}
    >
      <Icon size={16} className="mr-3 opacity-70" />
      {label}
    </button>
  );

  return (
    <div 
      ref={menuRef}
      style={style}
      className="fixed z-50 w-52 bg-edge-surface rounded-lg shadow-xl border border-edge-border py-1 animate-in fade-in zoom-in-95 duration-100"
    >
      <MenuItem 
        icon={tab.pinned ? Pin : Pin} 
        label={tab.pinned ? "Unpin tab" : "Pin tab"} 
        action="togglePin" 
      />
      <MenuItem 
        icon={tab.mutedInfo?.muted ? VolumeX : Volume2} 
        label={tab.mutedInfo?.muted ? "Unmute tab" : "Mute tab"} 
        action="toggleMute" 
      />
      <div className="h-px bg-edge-border my-1" />
      <MenuItem icon={Copy} label="Copy URL" action="copyUrl" />
      <MenuItem icon={Columns} label="Open in split screen" action="splitScreen" />
      <MenuItem icon={ExternalLink} label="Move to new window" action="newWindow" />
      <div className="h-px bg-edge-border my-1" />
      <MenuItem icon={X} label="Close tab" action="close" danger />
    </div>
  );
};

export default ContextMenu;
