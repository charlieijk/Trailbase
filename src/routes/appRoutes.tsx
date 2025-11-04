import type { AppRouteDefinition, NavigationItem } from '../types/navigation.types';

export const appRoutes: ReadonlyArray<AppRouteDefinition> = [
  {
    id: 'home',
    path: '/',
    label: 'Home',
    icon: 'fa-home',
    includeInNav: true,
  },
  {
    id: 'directory',
    path: '/directory',
    label: 'Directory',
    icon: 'fa-list',
    includeInNav: true,
  },
  {
    id: 'campsite-detail',
    path: '/directory/[campsiteId]',
    label: 'Campsite Details',
  },
  {
    id: 'about',
    path: '/about',
    label: 'About',
    icon: 'fa-info',
    includeInNav: true,
  },
  {
    id: 'contact',
    path: '/contact',
    label: 'Contact',
    icon: 'fa-address-card',
    includeInNav: true,
  },
  {
    id: 'signup',
    path: '/signup',
    label: 'Sign Up',
    icon: 'fa-user-plus',
    includeInNav: true,
  },
  {
    id: 'not-found',
    path: '/404',
    label: 'Not Found',
  },
];

export const navigationItems: NavigationItem[] = appRoutes
  .filter(({ includeInNav }) => includeInNav)
  .map(({ id, path, label, icon }) => ({
    id,
    path,
    label,
    icon,
  }));
