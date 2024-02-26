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
  public collectionState: Array<Partial<UserPerfume>> = [];
  private readonly subs: Subscription[] = [];

  ngOnInit(): void {
    this.getCollection();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  public shrinkCards() {
    this.collectionState = [
      ...this.collection.map(({ id, showNotes, showAccords }) => ({
        id,
        showNotes,
        showAccords,
      })),
    ];
    this.collection.forEach((perfume) => {
      perfume.showNotes = false;
      perfume.showAccords = false;
    });
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.collection, event.previousIndex, event.currentIndex);
    this.setUserSort();
    this.restoreCardStates();
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

  public getCollection(): void {
    this.subs.push(
      this.collectionService
        .getCollection()
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

  public handleSorting(value: CollectionSortOptions) {
    switch (value) {
      case CollectionSortOptions.COMPANY:
        this.clearSort();
        this.collection = this.collectionSort(this.collection);
        break;
      case CollectionSortOptions.PERFUME:
        this.clearSort();
        this.collection = this.collection.sort(this.nameSort);
        break;
    }
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

  private collectionSort(data: UserPerfume[]): UserPerfume[] {
    const initialSort = data.sort(this.nameSort).sort(this.companySort);

    const userSort = this.getUserSort();

    return userSort ? this.applyUserSort(userSort, initialSort) : initialSort;
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

  private restoreCardStates() {
    this.collection.forEach((perfume) => {
      const backup = this.collectionState.find(({ id }) => id === perfume.id);
      perfume.showNotes = backup!.showNotes;
      perfume.showAccords = backup!.showAccords;
    });
  }
}
