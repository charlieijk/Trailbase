export interface LegacyCampsite {
  id: number;
  name: string;
  image: string;
  elevation: number;
  featured: boolean;
  description: string;
}

export interface LegacyComment {
  id: number;
  campsiteId: number;
  rating: number;
  text: string;
  author: string;
  date: string;
}

export interface LegacyPartner {
  id: number;
  name: string;
  image: string;
  featured: boolean;
  description: string;
}

export interface LegacyPromotion {
  id: number;
  name: string;
  image: string;
  featured: boolean;
  description: string;
}

export type LegacyDisplayItem = LegacyCampsite | LegacyPromotion | LegacyPartner;
