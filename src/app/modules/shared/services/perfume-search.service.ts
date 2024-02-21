import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { SearchResult } from '../components/perfume-search/models/perfume-search.models';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class PerfumeSearchService {
  constructor(private http: HttpService) {}

  public query(val: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(
      `${environment.apiBaseUrl}/frag/${val}`
    );
  }
}
