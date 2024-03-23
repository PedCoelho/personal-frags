import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { updateCollection } from 'app/+state/app.actions';
import { State } from 'app/+state/app.reducers';
import {
  CollectionSortOptions,
  UserPerfume,
} from 'app/modules/collection/models/collection.models';
import { SearchResult } from 'app/modules/shared/components/perfume-search/models/perfume-search.models';
import { CollectionFiltersService } from 'app/modules/shared/services/collection-filters.service';
import { NotificationService } from 'app/modules/shared/services/notification.service';
import { Subscription, finalize, first, map } from 'rxjs';
import { CollectionService } from '../../services/collection.service';
import { CollectionFiltersComponent } from '../collection-filters/collection-filters.component';
import { CollectionSortComponent } from '../collection-sort/collection-sort.component';
import { CollectionTagsComponent } from '../collection-tags/collection-tags.component';
@Component({
  selector: 'collection-grid',
  templateUrl: './collection-grid.component.html',
  styleUrls: ['./collection-grid.component.scss'],
})
export class CollectionGridComponent implements OnDestroy, OnInit {
  constructor(
    private notification: NotificationService,
    private collectionService: CollectionService,
    private collectionFiltersService: CollectionFiltersService,
    private store: Store<State>,
    private bottomSheet: MatBottomSheet
  ) {}

  public loading = false;
  public collectionBackup: UserPerfume[] = [];
  public collection: UserPerfume[] = [];
  private readonly subs: Subscription[] = [];

  ngOnInit(): void {
    this.getCollection();
    this.getUserTags();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  public openSorting() {
    const ref = this.bottomSheet.open(CollectionSortComponent);

    //todo maybe switch to subscribing to service observables instead
    const subs = [
      ref.instance.sorted.subscribe((data) => this.handleSorting(data)),
    ];

    ref
      .afterDismissed()
      .pipe(first())
      .subscribe(() => subs.forEach((sub) => sub.unsubscribe()));
  }
  public openFilters() {
    const ref = this.bottomSheet.open(CollectionFiltersComponent);

    //todo maybe switch to subscribing to service observables instead
    const subs = [
      ref.instance.filtersCleared.subscribe(() => this.clearFilters()),
      ref.instance.filterByCompany.subscribe((data) =>
        this.handleCompanyFiltering(data)
      ),
    ];

    ref
      .afterDismissed()
      .pipe(first())
      .subscribe(() => subs.forEach((sub) => sub.unsubscribe()));
  }

  public openTags() {
    const ref = this.bottomSheet.open(CollectionTagsComponent);

    //todo maybe switch to subscribing to service observables instead
    ref.instance.getTags();

    ref.instance.confirmed.subscribe(() => {
      ref.dismiss();
    });

    // ref
    //   .afterDismissed()
    //   .pipe(first())
    //   .subscribe(() => subs.forEach((sub) => sub.unsubscribe()));
  }

  public shrinkCards() {
    this.collection.forEach((perfume) => {
      perfume.showNotes = false;
      perfume.showAccords = false;
    });
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.collection, event.previousIndex, event.currentIndex);
    this.setUserSort(this.collection);
  }

  public addToCollection(perfume: SearchResult) {
    if (perfume.saved) return this.removeFromCollection(perfume);

    this.loading = true;
    perfume.loading = true;

    this.notification.info(
      `Salvando perfume ${perfume.naslov} na sua coleção.`
    );

    const sub = this.collectionService
      .addPerfume(perfume)
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
      .removePerfume(perfume.id)
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

  public getCollection(): void {
    this.subs.push(
      this.collectionService
        .getAll()
        .pipe(map((data) => this.collectionSort(data)))
        .subscribe((data) => {
          this.collection = data;
          this.collectionBackup = data;
          this.store.dispatch(
            updateCollection({ collection: this.collection })
          );
        })
    );
  }

  public getUserTags(): void {
    this.subs.push(this.collectionService.getTags().subscribe());
  }

  public showCollapseAll() {
    return this.collection.some((perfume) => perfume.showNotes);
  }

  public showClearSort() {
    //todo could be an observable async pipe
    return (
      this.collectionFiltersService.sortMethod !== CollectionSortOptions.COMPANY
    );
  }

  public showClearFilters() {
    //todo could be an observable async pipe
    return this.collectionFiltersService.currentFilters.length;
  }

  public handleSorting(value: CollectionSortOptions) {
    this.clearUserSort();
    let tempCollection = [...this.collection].sort(this.nameSort);

    switch (value) {
      case CollectionSortOptions.COMPANY:
        tempCollection = tempCollection.sort(this.companySort);
        break;
      case CollectionSortOptions.PERFUME:
        tempCollection = tempCollection.sort(this.nameSort);
        break;
      case CollectionSortOptions.PRICE:
        tempCollection = tempCollection.sort(this.priceSort);
        break;
      case CollectionSortOptions.USER_RATING:
        tempCollection = tempCollection.sort(this.userRatingSort);
        break;
      case CollectionSortOptions.FRAGRANTICA_RATING:
        tempCollection = tempCollection.sort(this.ratingSort);
        break;
    }

    this.collection = tempCollection;

    return this.collection;
  }

  private setUserSort(val: UserPerfume[]): void {
    localStorage.setItem(
      'collection-sort',
      val.map((perfume, i) => perfume.id).join(',')
    );
    this.collectionFiltersService.sortMethod = CollectionSortOptions.CUSTOM;
  }

  public getUserSort(): string[] | undefined {
    const data = localStorage.getItem('collection-sort')?.split(',');
    if (data?.length) return data;
    else return undefined;
  }

  public clearSorting() {
    this.collectionFiltersService.sortMethod =
      this.collectionFiltersService.DEFAULT_SORT;
    this.handleSorting(this.collectionFiltersService.sortMethod);
  }

  public clearFilters() {
    this.collection = this.collectionBackup;
    this.collectionFiltersService.currentFilters = [];
    this.handleSorting(this.collectionFiltersService.sortMethod);
  }

  public handleCompanyFiltering(filters: any) {
    this.collection = this.collectionBackup.filter((perfume) =>
      filters.some((company: string) => perfume.company === company)
    );

    this.handleSorting(this.collectionFiltersService.sortMethod);
  }

  private companySort = (a: UserPerfume, b: UserPerfume) =>
    b.company > a.company ? -1 : 1;

  private nameSort = (a: UserPerfume, b: UserPerfume) =>
    b.name > a.name ? -1 : 1;

  private priceSort = (a: UserPerfume, b: UserPerfume) =>
    (b.user_price ?? 0) >= (a.user_price ?? 0) ? 1 : -1;

  private ratingSort = (a: UserPerfume, b: UserPerfume) =>
    b.rating >= a.rating ? 1 : -1;

  private userRatingSort = (a: UserPerfume, b: UserPerfume) =>
    (b.user_rating ?? 0) >= (a.user_rating ?? 0) ? 1 : -1;

  private collectionSort(data: UserPerfume[]): UserPerfume[] {
    this.collection = data;
    const userSort = this.getUserSort();

    return userSort
      ? this.applyUserSort(userSort, data)
      : this.handleSorting(this.collectionFiltersService.sortMethod);
  }

  private applyUserSort(
    userSort: string[],
    initialSort: UserPerfume[]
  ): UserPerfume[] {
    const initialSortCopy = [...initialSort];
    initialSortCopy.forEach((perfume) => {
      const userSortIndex = userSort.indexOf(perfume.id);
      if (userSortIndex !== -1)
        moveItemInArray(
          initialSort,
          initialSort.indexOf(perfume),
          userSortIndex
        );
    });

    this.setUserSort(initialSort);

    return initialSort;
  }

  private clearUserSort() {
    localStorage.removeItem('collection-sort');
  }
}
