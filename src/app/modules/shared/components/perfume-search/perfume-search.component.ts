import {
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from 'app/+state/app.reducers';
import { UserPerfume } from 'app/modules/collection/models/collection.models';
import { CollectionService } from 'app/modules/collection/services/collection.service';
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

  @Output('update-list') requireUpdate = new EventEmitter();

  public searchBar: FormControl = new FormControl(['']);
  public results: SearchResult[] = [];

  public showResults = false;
  public loading = false;

  private subs: Subscription[] = [];
  private userCollection: UserPerfume[] = [];

  constructor(
    private searchService: PerfumeSearchService,
    private notification: NotificationService,
    private collection: CollectionService,
    private store: Store<State>
  ) {
    this.subs.push(
      this.store.select('collection').subscribe(({ collection }) => {
        this.userCollection = collection;
        this.results = this.syncSavedResults(this.results);
      })
    );
  }

  public ngOnInit(): void {
    this.setupSearchListener();
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
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
          this.results = data ? data : [];
        })
    );
  }

  public addToCollection(perfume: SearchResult) {
    if (perfume.saved) return this.removeFromCollection(perfume);

    this.loading = true;
    perfume.loading = true;

    this.notification.info(
      `Salvando perfume ${perfume.naslov} na sua coleção.`
    );

    const sub = this.collection
      .addPerfume(perfume)
      .pipe(
        finalize(() => {
          this.loading = false;
          delete perfume.loading;
        })
      )
      .subscribe(() => {
        this.notification.success(`Perfume salvo com sucesso.`);
        this.requireUpdate.emit();
      });

    this.subs.push(sub);
  }

  public removeFromCollection(perfume: SearchResult | UserPerfume) {
    this.loading = true;
    perfume.loading = true;

    const sub = this.collection
      .removePerfume(perfume.id)
      .pipe(
        finalize(() => {
          this.loading = false;
          delete perfume.loading;
        })
      )
      .subscribe(() => {
        this.notification.success(`Perfume removido com sucesso.`);
        this.requireUpdate.emit();
      });
    this.subs.push(sub);
  }

  private syncSavedResults(results: SearchResult[]) {
    return results.map((perfume: SearchResult) => ({
      ...perfume,
      saved: Boolean(
        this.userCollection.find((frag) => frag.id === perfume.id)
      ),
    }));
  }
}
