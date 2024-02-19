import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

export interface PerfumeResult {
  collection: string;
  dizajner: string;
  id: string;
  naslov: string;
  num_komentara: string;
  num_reviews: number;
  objectID: string;
  picture: string;
  rating: number;
  spol: string;
  thumbnail: string;
  url: { PT: string; EN: string };
}

@Injectable({
  providedIn: 'root',
})
export class PerfumeSearchService {
  constructor(private http: HttpService) {}

  public query(val: string): Observable<PerfumeResult[]> {
    return this.http.get<PerfumeResult[]>(
      `${environment.apiBaseUrl}/frag/${val}`
    );
  }
}
