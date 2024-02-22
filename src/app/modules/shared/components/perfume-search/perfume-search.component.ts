import {
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
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

  constructor(
    private searchService: PerfumeSearchService,
    private notification: NotificationService,
    private collection: CollectionService
  ) {}

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
          console.log(data);
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
      .addToCollection(perfume)
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
      .removeFromCollection(perfume.id)
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
    return results;
    //todo update
    //   return results.map((perfume: SearchResult) => ({
    //     ...perfume,
    //     saved: Boolean(this.collection.find((frag) => frag.id === perfume.id)),
    //   }));
  }
}
