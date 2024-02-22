import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserPerfume } from 'app/modules/collection/models/collection.models';
import { CollectionService } from 'app/modules/shared/services/collection.service';
import {
  EMPTY,
  Subscription,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
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
export class PerfumeSearchComponent implements OnInit, OnDestroy {
  @HostListener('click', ['$event'])
  handleClick(e: PointerEvent) {
    this.showResults = true;
    e.stopPropagation();
  }

  @HostListener('document:click')
  clickOutside(): false | void {
    if (this.loading) return false;
    this.showResults = false;
  }

  public searchBar: FormControl = new FormControl(['']);
  public results: SearchResult[] = [];
  public collection: UserPerfume[] = [];

  public showResults = false;
  public loading = false;

  private subs: Subscription[] = [];

  constructor(
    private searchService: PerfumeSearchService,
    private collectionService: CollectionService,
    private notification: NotificationService
  ) {}

  public ngOnInit(): void {
    this.getCollection();
    this.setupSearchListener();
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
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

    const sub = this.collectionService
      .addToCollection(perfume)
      .pipe(
        finalize(() => {
          this.loading = false;
          delete perfume.loading;
        })
      )
      .subscribe((data) => {
        console.log(data);
        this.notification.success(`Perfume salvo com sucesso.`);
        this.getCollection();
      });

    this.subs.push(sub);
  }

  public trackPerfumeBy(index: number, perfume: UserPerfume): string {
    return perfume.id;
  }

  public removeFromCollection(perfume: SearchResult | UserPerfume) {
    this.loading = true;
    (perfume as SearchResult).loading = true;

    const sub = this.collectionService
      .removeFromCollection(perfume.id)
      .pipe(
        finalize(() => {
          this.loading = false;
          delete (perfume as SearchResult).loading;
        })
      )
      .subscribe(() => {
        this.notification.success(`Perfume removido com sucesso.`);
        this.getCollection();
      });
    this.subs.push(sub);
  }

  //todo separate into own component
  private getCollection(): void {
    this.subs.push(
      this.collectionService.getCollection().subscribe((data) => {
        this.collection = data;
        this.results = this.syncSavedResults(this.results);
      })
    );
  }

  private setupSearchListener(): void {
    this.subs.push(
      this.searchBar.valueChanges
        .pipe(
          distinctUntilChanged(),
          debounceTime(200),
          filter((v) => {
            if (!v) this.results = [];
            return v;
          }),
          switchMap((val: string) =>
            this.searchService.query(val).pipe(catchError((e) => EMPTY))
          ),
          map((results) => this.syncSavedResults(results))
        )
        .subscribe((data) => {
          console.log(data);
          this.results = data ? data : [];
        })
    );
  }

  private syncSavedResults(results: SearchResult[]) {
    return results.map((perfume: SearchResult) => ({
      ...perfume,
      saved: Boolean(this.collection.find((frag) => frag.id === perfume.id)),
    }));
  }
}
