export interface UserPerfume {
  name: string;
  thumbnail: string;
  id: string;
  notes: Record<string, PerfumeNote[]>;
}

export interface PerfumeNote {
  name?: string;
  image?: string;
  link?: string;
}
