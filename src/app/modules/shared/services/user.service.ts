import { Injectable } from '@angular/core';
import { UserPerfume } from 'app/modules/collection/models/collection.models';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { SearchResult } from '../components/perfume-search/models/perfume-search.models';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpService) {}

  public getCollection(): Observable<UserPerfume[]> {
    return this.http.get<UserPerfume[]>(
      `${environment.apiBaseUrl}/frag/perfume/collection`
    );
  }

  public addToCollection(perfume: SearchResult): Observable<any> {
    const payload = {
      name: perfume.naslov,
      id: perfume.id,
      url: perfume.url.PT[0],
      thumbnail: perfume.thumbnail,
      //todo maybe add collection and other relevant props not scraped
    };
    return this.http.post(`${environment.apiBaseUrl}/frag/perfume`, payload);
  }
  public removeFromCollection(id: string): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/frag/perfume/${id}`);
  }
}
