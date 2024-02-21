export interface SearchResult {
  collection: string;
  dizajner: string;
  id: string;
  naslov: string;
  num_komentara: string;
  num_reviews: number;
  objectID: string;
  picture: string;
  rating: number;
  rating_rounded: number;
  spol: string;
  thumbnail: string;
  url: { PT: string[]; EN: string[] };
  saved?: boolean;
  loading?: boolean;
}
