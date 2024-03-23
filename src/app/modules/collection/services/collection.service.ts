import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { removeTag, updateTags } from 'app/+state/app.actions';
import {
  PerfumeTag,
  UserPerfume,
} from 'app/modules/collection/models/collection.models';
import { environment } from 'environments/environment';
import { Observable, tap } from 'rxjs';
import { SearchResult } from '../../shared/components/perfume-search/models/perfume-search.models';
import { HttpService } from '../../shared/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  constructor(private http: HttpService, private store: Store) {}

  public getAll(): Observable<UserPerfume[]> {
    return this.http.get<UserPerfume[]>(
      `${environment.apiBaseUrl}/frag/perfume/collection`
    );
  }

  public getTags(): Observable<PerfumeTag[]> {
    return this.http
      .get<PerfumeTag[]>(`${environment.apiBaseUrl}/frag/perfume/tags`)
      .pipe(tap((tags) => this.store.dispatch(updateTags({ tags }))));
  }

  public setTags(tags: PerfumeTag[]): Observable<void> {
    return this.http
      .put<void>(`${environment.apiBaseUrl}/frag/perfume/tags`, tags)
      .pipe(tap(() => this.store.dispatch(updateTags({ tags }))));
  }

  public deleteTag(id: string): Observable<void> {
    return this.http
      .delete<void>(`${environment.apiBaseUrl}/frag/perfume/tags/${id}`)
      .pipe(tap(() => this.store.dispatch(removeTag({ id }))));
  }

  public addPerfume(perfume: SearchResult): Observable<any> {
    const payload = {
      name: perfume.naslov,
      id: perfume.id,
      url: perfume.url.PT[0],
      thumbnail: perfume.thumbnail,
      company: perfume.dizajner,
      rating: perfume.rating,
    };
    return this.http.post(
      `${environment.apiBaseUrl}/frag/perfume/save`,
      payload
    );
  }

  public removePerfume(id: string): Observable<any> {
    return this.http.delete(
      `${environment.apiBaseUrl}/frag/perfume/collection/${id}`
    );
  }

  public updatePerfume(
    id: string,
    perfume: Partial<UserPerfume>
  ): Observable<any> {
    return this.http.put(
      `${environment.apiBaseUrl}/frag/perfume/collection/${id}`,
      perfume
    );
  }
}
