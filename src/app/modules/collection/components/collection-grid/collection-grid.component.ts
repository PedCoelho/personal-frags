import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { updateCollection } from 'app/+state/app.actions';
import { State } from 'app/+state/app.reducers';
import { UserPerfume } from 'app/modules/collection/models/collection.models';
import { SearchResult } from 'app/modules/shared/components/perfume-search/models/perfume-search.models';
import { NotificationService } from 'app/modules/shared/services/notification.service';
import { Subscription, finalize } from 'rxjs';
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
      this.collectionService.getCollection().subscribe((data) => {
        this.collection = data;
        this.store.dispatch(updateCollection({ collection: this.collection }));
      })
    );
  }
}
