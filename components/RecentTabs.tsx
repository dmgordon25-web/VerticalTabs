import React, { useState, useEffect } from 'react';
import { tabService } from '../services/tabService';
import { Clock, X } from 'lucide-react';

interface RecentTabsProps {
  onClose: () => void;
  onRestore: (url: string) => void;
}

const RecentTabs: React.FC<RecentTabsProps> = ({ onClose, onRestore }) => {
  const [recent, setRecent] = useState<{id: number, title: string, url: string}[]>([]);

  useEffect(() => {
    tabService.getRecentlyClosed().then(setRecent);
  }, []);

  return (
    <div className="absolute top-[90px] left-2 w-64 bg-edge-surface rounded-lg shadow-xl border border-edge-border z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between px-3 py-2 border-b border-edge-border">
        <h3 className="text-xs font-bold text-edge-muted uppercase">Recently Closed</h3>
        <button onClick={onClose} className="p-1 hover:bg-edge-hover rounded-sm text-edge-muted">
          <X size={14} />
        </button>
      </div>
      <div className="py-1 max-h-60 overflow-y-auto">
        {recent.length === 0 && (
          <div className="px-4 py-3 text-xs text-edge-muted text-center">
            No recently closed tabs
          </div>
        )}
        {recent.map(item => (
          <button
            key={item.id}
            onClick={() => onRestore(item.url)}
            className="w-full text-left px-3 py-2 hover:bg-edge-hover flex items-center group"
          >
            <Clock size={14} className="text-edge-muted mr-2 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm text-edge-text truncate leading-tight">{item.title}</div>
              <div className="text-xs text-edge-muted truncate">{new URL(item.url).hostname}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentTabs;
