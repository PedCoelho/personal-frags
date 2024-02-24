import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { updateCollection } from 'app/+state/app.actions';
import { State } from 'app/+state/app.reducers';
import { UserPerfume } from 'app/modules/collection/models/collection.models';
import { SearchResult } from 'app/modules/shared/components/perfume-search/models/perfume-search.models';
import { NotificationService } from 'app/modules/shared/services/notification.service';
import { Subscription, finalize, map } from 'rxjs';
import { CollectionService } from '../../services/collection.service';
@Component({
  selector: 'collection-grid',
  templateUrl: './collection-grid.component.html',
  styleUrls: ['./collection-grid.component.scss'],
})
export class CollectionGridComponent implements OnDestroy, OnInit {
  constructor(
    private notification: NotificationService,
    private collectionService: CollectionService,
    private store: Store<State>
  ) {}

  public loading = false;
  public collection: UserPerfume[] = [];
  private readonly subs: Subscription[] = [];

  ngOnInit(): void {
    this.getCollection();
  }
  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
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
          this.store.dispatch(
            updateCollection({ collection: this.collection })
          );
        })
    );
  }

  private setUserSort(): void {
    //todo when userSort is added, show a way to reset user sort
    localStorage.setItem(
      'collection-sort',
      this.collection.map((perfume, i) => perfume.id).join(',')
    );
  }

  private getUserSort(): string[] | undefined {
    const data = localStorage.getItem('collection-sort')?.split(',');
    if (data?.length) return data;
    else return undefined;
  }

  private collectionSort(data: UserPerfume[]): UserPerfume[] {
    const companySort = (a: UserPerfume, b: UserPerfume) =>
      b.company > a.company ? -1 : 1;

    const nameSort = (a: UserPerfume, b: UserPerfume) =>
      b.name > a.name ? -1 : 1;

    const initialSort = data.sort(nameSort).sort(companySort);

    const userSort = this.getUserSort();

    return userSort ? this.applyUserSort(userSort, initialSort) : initialSort;
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
          initialSortCopy,
          initialSort.indexOf(perfume),
          userSortIndex
        );
    });

    return initialSortCopy;
  }
}
