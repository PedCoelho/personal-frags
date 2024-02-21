import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  EMPTY,
  Subscription,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  switchMap,
} from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { PerfumeSearchService } from '../../services/perfume-search.service';
import { SearchResult } from './models/perfume-search.models';

@Component({
  selector: 'perfume-search',
  templateUrl: './perfume-search.component.html',
  styleUrls: ['./perfume-search.component.scss'],
})
export class PerfumeSearchComponent implements OnDestroy {
  public searchBar: FormControl = new FormControl(['']);
  public results: SearchResult[] = [];
  public showResults = false;
  public loading = false;

  private subs: Subscription[] = [];

  constructor(
    private searchService: PerfumeSearchService,
    private notification: NotificationService
  ) {
    const searchSub = this.searchBar.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(200),
        filter((v) => {
          if (!v) this.results = [];
          return v;
        }),
        switchMap((val: string) =>
          this.searchService.query(val).pipe(catchError((e) => EMPTY))
        )
      )
      .subscribe((data) => {
        console.log(data);
        //todo have a function that checks and assigns perfume.saved for perfume ID's in user's collection
        this.results = data ? data : [];
      });

    this.subs.push(searchSub);
  }

  public arrayFromRating(rating: SearchResult['rating_rounded']) {
    return new Array(rating);
  }

  public addToCollection(perfume: SearchResult) {
    if (perfume.saved) return this.removeFromCollection(perfume);

    this.loading = true;
    perfume.loading = true;

    this.notification.info(
      `Salvando perfume ${perfume.naslov} na sua coleção.`
    );

    const sub = this.searchService
      .addToCollection(perfume)
      .pipe(
        finalize(() => {
          this.loading = false;
          delete perfume.loading;
        })
      )
      .subscribe((data) => {
        perfume.saved = true;
        console.log(data);
        this.notification.success(`Perfume salvo com sucesso.`);
      });

    this.subs.push(sub);
  }

  private removeFromCollection(perfume: SearchResult) {
    this.loading = true;
    perfume.loading = true;

    this.notification.info(
      `Removendo perfume ${perfume.naslov} da sua coleção.`
    );
    delete perfume.saved;
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
