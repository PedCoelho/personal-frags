export enum CollectionSortOptions {
  CUSTOM,
  COMPANY,
  PERFUME,
  PRICE,
  USER_RATING,
  FRAGRANTICA_RATING,
}

export enum CollectionFilterOptions {
  COMPANY,
  PERFUME,
  PERFUMER,
}

export interface UserPerfume {
  id: string;
  name: string;
  thumbnail: string;
  company: string;
  rating: number;
  notes: Record<string, PerfumeNote[]>;
  accords: PerfumeAccord[];
  perfumers?: { name: string; url: string; image: string }[];
  loading?: boolean;
  showNotes?: boolean;
  showAccords?: boolean;
  user_tags?: PerfumeTag['id'][];
  user_rating?: number;
  user_owned?: OwnershipStatus;
  user_price?: number;
}

export enum OwnershipStatus {
  OWNED = 'owned',
  DECANT = 'decant',
  WANTED = 'wanted',
  PREVIOUSLY_OWNED = 'previously-owned',
}

export const ownershipStatusOptions: {
  label: string;
  value: OwnershipStatus;
}[] = [
  { label: 'Quero', value: OwnershipStatus.WANTED },
  { label: 'Tive', value: OwnershipStatus.PREVIOUSLY_OWNED },
  { label: 'Decant', value: OwnershipStatus.DECANT },
  { label: 'Tenho', value: OwnershipStatus.OWNED },
];

export interface PerfumeTag {
  label: string;
  color?: string;
  id?: string;
}

export interface PerfumeNote {
  name: string;
  image?: string;
  link?: string;
}

export interface PerfumeAccord {
  name: string;
  background: string;
  width: string;
}
