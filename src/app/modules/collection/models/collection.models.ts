export interface UserPerfume {
  id: string;
  name: string;
  thumbnail: string;
  company: string;
  rating: number;
  notes: Record<string, PerfumeNote[]>;
  loading?: boolean;
  showNotes?: boolean;
}

export interface PerfumeNote {
  name?: string;
  image?: string;
  link?: string;
}
