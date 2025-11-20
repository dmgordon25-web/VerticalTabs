export const MOCK_TABS = [
  {
    id: 1,
    index: 0,
    title: "Google - Search",
    url: "https://google.com",
    favIconUrl: "https://www.google.com/favicon.ico",
    active: true,
    pinned: false,
    status: "complete",
    groupId: -1
  },
  {
    id: 3,
    index: 1,
    title: "React Documentation",
    url: "https://react.dev",
    favIconUrl: "https://react.dev/favicon.ico",
    active: false,
    pinned: true,
    status: "complete",
    groupId: -1
  },
  {
    id: 4,
    index: 2,
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    favIconUrl: "https://tailwindcss.com/favicon.ico",
    active: false,
    pinned: true,
    status: "complete",
    groupId: -1
  },
  {
    id: 2,
    index: 3,
    title: "Edge Design Guidelines",
    url: "https://microsoft.com/edge",
    favIconUrl: "https://microsoft.com/favicon.ico",
    active: false,
    pinned: false,
    status: "complete",
    groupId: 1
  },
  {
    id: 5,
    index: 4,
    title: "Jira - Ticket #123",
    url: "https://jira.atlassian.com",
    favIconUrl: "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png",
    active: false,
    pinned: false,
    status: "complete",
    groupId: 1
  },
  {
    id: 6,
    index: 5,
    title: "GitHub - Repository",
    url: "https://github.com",
    favIconUrl: "https://github.com/favicon.ico",
    active: false,
    pinned: false,
    status: "complete",
    groupId: -1
  },
  {
    id: 7,
    index: 6,
    title: "Amazon.com",
    url: "https://amazon.com",
    favIconUrl: "https://www.amazon.com/favicon.ico",
    active: false,
    pinned: false,
    status: "complete",
    groupId: 2
  },
  {
    id: 8,
    index: 7,
    title: "Best Buy",
    url: "https://bestbuy.com",
    favIconUrl: "https://www.bestbuy.com/favicon.ico",
    active: false,
    pinned: false,
    status: "complete",
    groupId: 2
  }
] as const;

export const MOCK_GROUPS = [
  { id: 1, title: 'Work', color: 'blue', collapsed: false },
  { id: 2, title: 'Shopping', color: 'pink', collapsed: false }
] as const;