import type { LegacyPromotion } from '../../types/legacy.types';

export const PROMOTIONS: LegacyPromotion[] = [
  {
    id: 0,
    name: 'Mountain Adventure',
    image: '/assets/img/breadcrumb-trail.jpg',
    featured: true,
    description:
      'Book a 5-day mountain trek with a seasoned outdoor guide! Fly fishing equipment and lessons provided.',
  },
  {
    id: 1,
    name: 'Into The Weeds',
    image: '/assets/img/weeds.jpg',
    featured: false,
    description:
      '5 days deep in the Redux National Monument, far from the beaten path, with only a reducer in your backpack. Guide provided.',
  },
  {
    id: 2,
    name: 'Bootstrap Teardown',
    image: '/assets/img/boots.jpg',
    featured: false,
    description:
      "In this weekend workshop, we'll rebuild your bootstraps from scratch, so you're ready for next-level excursions.",
  },
  {
    id: 3,
    name: 'Asynchronous Rendezvous',
    image: '/assets/img/mount-promise.jpg',
    featured: false,
    description:
      'Meet up with your guide at the top of Promise Mountain. Or, try to. Good luck!',
  },
];
