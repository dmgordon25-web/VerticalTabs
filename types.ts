export interface ChromeTab {
  id: number;
  index: number;
  title: string;
  url: string;
  favIconUrl?: string;
  active: boolean;
  pinned: boolean;
  status: 'loading' | 'complete';
  groupId: number;
  mutedInfo?: {
    muted: boolean;
  };
  audible?: boolean;
}

export interface TabGroup {
  id: number;
  title?: string;
  color: 'grey' | 'blue' | 'red' | 'yellow' | 'green' | 'pink' | 'purple' | 'cyan' | 'orange';
  collapsed: boolean;
}

export interface ContextMenuPosition {
  x: number;
  y: number;
  tabId: number;
}