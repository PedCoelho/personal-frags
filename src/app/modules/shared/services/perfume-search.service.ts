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

  //todo type return
  public addToCollection(perfume: SearchResult): Observable<any> {
    const payload = {
      name: perfume.naslov,
      id: perfume.id,
      url: perfume.url.PT[0],
      thumbnail: perfume.thumbnail,
      //todo maybe add collection and other relevant props not scraped
    };
    return this.http.post(
      `${environment.apiBaseUrl}/frag/perfume/save`,
      payload
    );
  }
}
