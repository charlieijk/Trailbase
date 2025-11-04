import type { LegacyCampsite } from '../../types/legacy.types';

export const CAMPSITES: LegacyCampsite[] = [
  {
    id: 0,
    name: 'React Lake Campground',
    image: '/assets/img/react-lake.jpg',
    elevation: 1233,
    featured: false,
    description:
      'Nestled in the foothills of the Chrome Mountains, this campground on the shores of the pristine React Lake is a favorite for fly fishers.',
  },
  {
    id: 1,
    name: 'Chrome River Campground ',
    image: '/assets/img/chrome-river.jpg',
    elevation: 877,
    featured: false,
    description:
      'Spend a few sunny days and starry nights beneath a canopy of old-growth firs at this enchanting spot by the Chrome River.',
  },
  {
    id: 2,
    name: 'Breadcrumb Trail Campground',
    image: '/assets/img/breadcrumb-trail.jpg',
    elevation: 2901,
    featured: false,
    description:
      'Let Trailbase be your guide to this off-the-beaten-path, hike-in-only campground.',
  },
  {
    id: 3,
    name: 'Redux Woods Campground',
    image: '/assets/img/redux-woods.jpg',
    elevation: 42,
    featured: true,
    description:
      "You'll never want to leave this hidden gem, deep within the lush Redux Woods.",
  },
];
