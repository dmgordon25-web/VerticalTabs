import { ChromeTab, TabGroup } from '../types';
import { MOCK_TABS, MOCK_GROUPS } from '../constants';

declare const chrome: any;

// Helper to detect if we are in a real extension environment
const isExtensionEnv = typeof chrome !== 'undefined' && !!chrome.tabs;

class TabService {
  private mockTabs: ChromeTab[] = [...MOCK_TABS];
  private mockGroups: TabGroup[] = [...MOCK_GROUPS];
  private listeners: (() => void)[] = [];

  constructor() {
    if (isExtensionEnv) {
      // Listen to real chrome events to update UI
      const events = [
        chrome.tabs.onUpdated,
        chrome.tabs.onCreated,
        chrome.tabs.onRemoved,
        chrome.tabs.onActivated,
        chrome.tabs.onMoved,
        chrome.tabs.onAttached,
        chrome.tabs.onDetached,
        chrome.tabGroups?.onUpdated,
        chrome.tabGroups?.onCreated,
        chrome.tabGroups?.onRemoved
      ];

      events.forEach(event => {
        if (event) event.addListener(this.notifyListeners);
      });
    }
  }

  private notifyListeners = () => {
    // Debounce slightly to prevent UI flickering on bulk updates
    setTimeout(() => {
      this.listeners.forEach(cb => cb());
    }, 50);
  };

  public subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  public async getTabs(): Promise<ChromeTab[]> {
    if (isExtensionEnv) {
      return new Promise((resolve) => {
        chrome.tabs.query({ currentWindow: true }, (tabs: any[]) => {
          const formattedTabs: ChromeTab[] = tabs.map(t => ({
            id: t.id || 0,
            index: t.index,
            title: t.title || 'New Tab',
            url: t.url || '',
            favIconUrl: t.favIconUrl,
            active: t.active,
            pinned: t.pinned,
            status: t.status as 'loading' | 'complete',
            groupId: t.groupId,
            mutedInfo: t.mutedInfo,
            audible: t.audible
          }));
          resolve(formattedTabs.sort((a, b) => a.index - b.index));
        });
      });
    }
    // Mock Data
    return Promise.resolve([...this.mockTabs].sort((a, b) => a.index - b.index));
  }

  public async getTabGroups(): Promise<Record<number, TabGroup>> {
    if (isExtensionEnv && chrome.tabGroups) {
      return new Promise((resolve) => {
        chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (groups: any[]) => {
          const groupMap: Record<number, TabGroup> = {};
          groups.forEach(g => {
            groupMap[g.id] = {
              id: g.id,
              title: g.title,
              color: g.color,
              collapsed: g.collapsed
            };
          });
          resolve(groupMap);
        });
      });
    }
    // Mock Data
    const map: Record<number, TabGroup> = {};
    this.mockGroups.forEach(g => map[g.id] = g);
    return Promise.resolve(map);
  }

  public async activateTab(tabId: number): Promise<void> {
    if (isExtensionEnv) {
      await chrome.tabs.update(tabId, { active: true });
    } else {
      this.mockTabs = this.mockTabs.map(t => ({ ...t, active: t.id === tabId }));
      this.notifyListeners();
    }
  }

  public async closeTab(tabId: number): Promise<void> {
    if (isExtensionEnv) {
      await chrome.tabs.remove(tabId);
    } else {
      this.mockTabs = this.mockTabs.filter(t => t.id !== tabId);
      this.notifyListeners();
    }
  }

  public async createTab(url?: string): Promise<void> {
    if (isExtensionEnv) {
      await chrome.tabs.create({ url });
    } else {
      const newTab: ChromeTab = {
        id: Date.now(),
        index: this.mockTabs.length,
        title: 'New Tab',
        url: url || 'about:blank',
        active: true,
        pinned: false,
        status: 'complete',
        favIconUrl: '',
        groupId: -1
      };
      this.mockTabs = this.mockTabs.map(t => ({...t, active: false}));
      this.mockTabs.push(newTab);
      this.notifyListeners();
    }
  }

  public async moveTab(tabId: number, newIndex: number): Promise<void> {
    if (isExtensionEnv) {
      await chrome.tabs.move(tabId, { index: newIndex });
    } else {
      const tabIndex = this.mockTabs.findIndex(t => t.id === tabId);
      if (tabIndex > -1) {
        const [tab] = this.mockTabs.splice(tabIndex, 1);
        this.mockTabs.splice(newIndex, 0, tab);
        // Re-index
        this.mockTabs = this.mockTabs.map((t, i) => ({...t, index: i}));
        this.notifyListeners();
      }
    }
  }

  public async toggleMute(tab: ChromeTab): Promise<void> {
    if (isExtensionEnv) {
      const currentlyMuted = tab.mutedInfo?.muted || false;
      await chrome.tabs.update(tab.id, { muted: !currentlyMuted });
    } else {
      const t = this.mockTabs.find(x => x.id === tab.id);
      if(t) {
        t.mutedInfo = { muted: !t.mutedInfo?.muted };
        this.notifyListeners();
      }
    }
  }

  public async togglePin(tab: ChromeTab): Promise<void> {
    if (isExtensionEnv) {
      await chrome.tabs.update(tab.id, { pinned: !tab.pinned });
    } else {
      const t = this.mockTabs.find(x => x.id === tab.id);
      if(t) {
        t.pinned = !t.pinned;
        this.notifyListeners();
      }
    }
  }

  public async toggleGroupCollapse(groupId: number, collapsed: boolean): Promise<void> {
    if (isExtensionEnv && chrome.tabGroups) {
      await chrome.tabGroups.update(groupId, { collapsed: !collapsed });
    } else {
      const group = this.mockGroups.find(g => g.id === groupId);
      if (group) {
        group.collapsed = !collapsed;
        this.notifyListeners();
      }
    }
  }

  public async updateTabSearch(query: string): Promise<ChromeTab[]> {
    const tabs = await this.getTabs();
    if (!query) return tabs;
    const lowerQuery = query.toLowerCase();
    return tabs.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) || 
      t.url.toLowerCase().includes(lowerQuery)
    );
  }

  // Mock implementation for recently closed tabs
  public async getRecentlyClosed(): Promise<{id: number, title: string, url: string}[]> {
    // In a real extension, this would use chrome.sessions.getRecentlyClosed
    // For now, we return static mock data
    return [
      { id: 101, title: 'Closed Tab 1', url: 'https://example.com' },
      { id: 102, title: 'Old Article about React', url: 'https://react.dev' },
      { id: 103, title: 'Funny Cat Video', url: 'https://youtube.com' }
    ];
  }
}

export const tabService = new TabService();
