export interface UserPerfume {
  id: string;
  name: string;
  thumbnail: string;
  company: string;
  rating: number;
  notes: Record<string, PerfumeNote[]>;
  accords: PerfumeAccord[];
  loading?: boolean;
  showNotes?: boolean;
  showAccords?: boolean;
}

export interface PerfumeNote {
  name?: string;
  image?: string;
  link?: string;
}

export interface PerfumeAccord {
  name: string;
  background: string;
}
