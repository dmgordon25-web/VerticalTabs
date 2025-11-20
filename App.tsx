import React, { useState, useEffect, useCallback } from 'react';
import { tabService } from './services/tabService';
import { ChromeTab, TabGroup } from './types';
import TabItem from './components/TabItem';
import TabGroupHeader from './components/TabGroupHeader';
import SidebarHeader from './components/SidebarHeader';
import ContextMenu from './components/ContextMenu';
import RecentTabs from './components/RecentTabs';

const App: React.FC = () => {
  const [tabs, setTabs] = useState<ChromeTab[]>([]);
  const [groups, setGroups] = useState<Record<number, TabGroup>>({});
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showRecent, setShowRecent] = useState(false);
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; tab?: ChromeTab }>({
    visible: false, x: 0, y: 0
  });

  // Drag and Drop State
  const [draggedTabId, setDraggedTabId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    const [currentTabs, currentGroups] = await Promise.all([
      tabService.updateTabSearch(searchQuery),
      tabService.getTabGroups()
    ]);
    setTabs(currentTabs);
    setGroups(currentGroups);
    setLoading(false);
  }, [searchQuery]);

  // Initialize and subscribe
  useEffect(() => {
    loadData();
    const unsubscribe = tabService.subscribe(() => {
      loadData();
    });
    return () => unsubscribe();
  }, [loadData]);

  // Handlers
  const handleActivate = async (id: number) => await tabService.activateTab(id);
  const handleClose = async (id: number) => await tabService.closeTab(id);
  const handleNewTab = async () => await tabService.createTab();
  
  const handleToggleGroup = async (groupId: number) => {
    const group = groups[groupId];
    if (group) {
      await tabService.toggleGroupCollapse(groupId, group.collapsed);
    }
  };

  // Context Menu Handlers
  const handleContextMenu = (e: React.MouseEvent, tab: ChromeTab) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      tab
    });
  };

  const handleContextMenuAction = async (action: string, tab: ChromeTab) => {
    setContextMenu({ ...contextMenu, visible: false });
    switch (action) {
      case 'close':
        await tabService.closeTab(tab.id);
        break;
      case 'togglePin':
        await tabService.togglePin(tab);
        break;
      case 'toggleMute':
        await tabService.toggleMute(tab);
        break;
      case 'copyUrl':
        navigator.clipboard.writeText(tab.url);
        break;
      case 'splitScreen':
        // Simulate split screen by creating a new window to the side, or opening in new window
        // Since "Split Screen" in Edge is a specific view, we'll approximate by opening side-by-side
        // For a single tab extension, we just log or open a new window
        window.open(tab.url, '_blank', `left=${window.screen.width / 2},top=0,width=${window.screen.width / 2},height=${window.screen.height}`);
        break;
      case 'newWindow':
        await tabService.closeTab(tab.id);
        window.open(tab.url, '_blank');
        break;
    }
  };

  // Drag and Drop Handlers
  const onDragStart = (e: React.DragEvent, tabId: number) => {
    setDraggedTabId(tabId);
    e.dataTransfer.effectAllowed = 'move';
    // Hide ghost image slightly or customize it
    const ghost = document.createElement('div');
    ghost.classList.add('opacity-0');
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedTabId === null) return;
    
    const draggedTab = tabs.find(t => t.id === draggedTabId);
    if (!draggedTab) return;

    if (draggedTab.index === dropIndex) return;

    await tabService.moveTab(draggedTabId, dropIndex);
    setDraggedTabId(null);
  };

  const pinnedTabs = tabs.filter(t => t.pinned);
  const unpinnedTabs = tabs.filter(t => !t.pinned);

  // Helper to render unpinned tabs with group headers
  const renderUnpinnedTabs = () => {
    const renderedItems: React.ReactNode[] = [];
    let currentGroupId = -1;

    unpinnedTabs.forEach((tab) => {
      const group = tab.groupId > -1 ? groups[tab.groupId] : null;
      
      // If we encounter a new group, render the header
      if (tab.groupId !== currentGroupId) {
        if (group) {
          renderedItems.push(
            <TabGroupHeader 
              key={`group-${group.id}`}
              group={group}
              isCollapsed={isCollapsed}
              onToggle={() => handleToggleGroup(group.id)}
            />
          );
        }
        currentGroupId = tab.groupId;
      }

      // If group is collapsed, don't render tabs
      if (group && group.collapsed) {
        return;
      }

      renderedItems.push(
        <TabItem 
          key={tab.id} 
          index={tab.index} 
          tab={tab} 
          group={group || undefined}
          isActive={tab.active}
          isCollapsed={isCollapsed}
          onActivate={handleActivate}
          onClose={handleClose}
          onContextMenu={handleContextMenu}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
      );
    });

    return renderedItems;
  };

  return (
    <div className={`h-screen bg-edge-bg flex flex-col border-r border-edge-border transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[60px]' : 'w-full md:w-[320px]'}`}>
      
      <SidebarHeader 
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewTab={handleNewTab}
        onToggleRecent={() => setShowRecent(!showRecent)}
      />

      {showRecent && (
        <RecentTabs 
          onClose={() => setShowRecent(false)}
          onRestore={(url) => {
            tabService.createTab(url);
            setShowRecent(false);
          }}
        />
      )}

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-4 pt-1 relative">
        
        {loading && (
          <div className="p-4 text-center text-edge-muted text-sm">
            Loading...
          </div>
        )}

        {/* Pinned Tabs */}
        {pinnedTabs.length > 0 && (
          <div className="mb-2">
             {!isCollapsed && searchQuery === '' && (
                <div className="px-4 py-2 text-[11px] font-bold text-edge-muted/80 uppercase tracking-wider">
                  Pinned
                </div>
             )}
             {pinnedTabs.map((tab, idx) => (
               <TabItem 
                 key={tab.id} 
                 index={idx}
                 tab={tab} 
                 isActive={tab.active}
                 isCollapsed={isCollapsed}
                 onActivate={handleActivate}
                 onClose={handleClose}
                 onContextMenu={handleContextMenu}
                 onDragStart={() => {}} 
                 onDragOver={() => {}}
                 onDrop={() => {}}
               />
             ))}
             {unpinnedTabs.length > 0 && (
               <div className="mx-4 my-2 border-b border-edge-border" />
             )}
          </div>
        )}

        {/* Regular Tabs with Group Logic */}
        <div className="space-y-[1px]">
           {!loading && tabs.length === 0 && (
             <div className="flex flex-col items-center justify-center pt-10 px-4 text-center opacity-50">
               <span className="text-4xl mb-2 grayscale">📄</span>
               {!isCollapsed && <p className="text-sm text-edge-muted">No tabs found</p>}
             </div>
           )}
           
           {renderUnpinnedTabs()}
        </div>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-edge-border text-xs text-edge-muted flex justify-between items-center bg-edge-bg">
           <span>{tabs.length} open tabs</span>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.visible && contextMenu.tab && (
        <ContextMenu 
          position={{ x: contextMenu.x, y: contextMenu.y }}
          tab={contextMenu.tab}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
          onAction={handleContextMenuAction}
        />
      )}
    </div>
  );
};

export default App;
