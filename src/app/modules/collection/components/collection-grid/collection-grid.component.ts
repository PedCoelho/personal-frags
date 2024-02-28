import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { updateCollection } from 'app/+state/app.actions';
import { State } from 'app/+state/app.reducers';
import {
  CollectionSortOptions,
  UserPerfume,
} from 'app/modules/collection/models/collection.models';
import { SearchResult } from 'app/modules/shared/components/perfume-search/models/perfume-search.models';
import { NotificationService } from 'app/modules/shared/services/notification.service';
import { Subscription, finalize, map } from 'rxjs';
import { CollectionService } from '../../services/collection.service';
import { CollectionFiltersBarComponent } from '../collection-filters-bar/collection-filters-bar.component';
@Component({
  selector: 'collection-grid',
  templateUrl: './collection-grid.component.html',
  styleUrls: ['./collection-grid.component.scss'],
})
export class CollectionGridComponent implements OnDestroy, OnInit {
  @ViewChild(CollectionFiltersBarComponent)
  filterBar!: CollectionFiltersBarComponent;

  constructor(
    private notification: NotificationService,
    private collectionService: CollectionService,
    private store: Store<State>
  ) {}

  public loading = false;
  public collectionBackup: UserPerfume[] = [];
  public collection: UserPerfume[] = [];
  private readonly subs: Subscription[] = [];

  ngOnInit(): void {
    this.getCollection();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  public shrinkCards() {
    this.collection.forEach((perfume) => {
      perfume.showNotes = false;
      perfume.showAccords = false;
    });
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.collection, event.previousIndex, event.currentIndex);
    this.setUserSort();
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

  public showCollapseAll() {
    return this.collection.some((perfume) => perfume.showNotes);
  }

  public handleSorting(value: CollectionSortOptions) {
    this.clearSort();
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

  private setUserSort(): void {
    localStorage.setItem(
      'collection-sort',
      this.collection.map((perfume, i) => perfume.id).join(',')
    );
    this.filterBar.setSortMethod(CollectionSortOptions.CUSTOM);
  }

  public getUserSort(): string[] | undefined {
    const data = localStorage.getItem('collection-sort')?.split(',');
    if (data?.length) return data;
    else return undefined;
  }

  public clearFilters() {
    console.log('clear filters');
    this.collection = this.collectionBackup;
    this.handleSorting(this.filterBar.sortMethod.value);
  }

  public handleCompanyFiltering(filters: any) {
    this.collection = this.collectionBackup.filter((perfume) =>
      filters.some((company: string) => perfume.company === company)
    );

    this.handleSorting(this.filterBar.sortMethod.value);
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
      : this.handleSorting(this.filterBar.sortMethod.value);
  }

  private applyUserSort(
    userSort: string[],
    initialSort: UserPerfume[]
  ): UserPerfume[] {
    this.filterBar.setSortMethod(CollectionSortOptions.CUSTOM);
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

    return initialSort;
  }

  private clearSort() {
    localStorage.removeItem('collection-sort');
  }
}
