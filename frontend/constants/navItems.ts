import { DASHBOARD_PAGES } from '@/config/pages-url.config'

export const NAV_ITEMS = [
  { label: 'general', path: DASHBOARD_PAGES.GENERAL },
  { label: 'rentals', path: DASHBOARD_PAGES.HOLIDAY_RENTALS },
  { label: 'future_home', path: DASHBOARD_PAGES.YOUR_FUTURE_HOME },
  { label: 'residence', path: DASHBOARD_PAGES.RESIDENCE },
  { label: 'studying', path: DASHBOARD_PAGES.STUDYING_IN_MALTA },
  { label: 'blog', path: DASHBOARD_PAGES.BLOG },
] as const;

export const RESIDENCE_SUB_ITEMS = [
  { label: 'mprp', path: '/residence/mprp' },
  { label: 'nomad', path: '/residence/nomad' },
  { label: 'grp', path: '/residence/grp' },
  { label: 'trp', path: '/residence/trp' },
  { label: 'citizenship', path: '/residence/citizenship' },
] as const;