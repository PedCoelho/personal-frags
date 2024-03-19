import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from 'app/+state/app.reducers';
import { CollectionFiltersService } from 'app/modules/shared/services/collection-filters.service';
import { Subscription } from 'rxjs';
import { CollectionSortOptions } from '../../models/collection.models';

@Component({
  selector: 'collection-sort',
  templateUrl: './collection-sort.component.html',
  styleUrls: ['./collection-sort.component.scss'],
})
export class CollectionSortComponent implements OnDestroy {
  @Output() sorted = new EventEmitter<CollectionSortOptions>();

  public clearSortEnabled = false;

  public readonly subs: Subscription[] = [];

  public readonly sortOptions: {
    label: string;
    value: CollectionSortOptions;
    disabled?: boolean;
  }[] = [
    { label: 'Empresa', value: CollectionSortOptions.COMPANY },
    { label: 'Perfume', value: CollectionSortOptions.PERFUME },
    { label: 'Preço', value: CollectionSortOptions.PRICE },
    {
      label: 'Nota Fragrantica',
      value: CollectionSortOptions.FRAGRANTICA_RATING,
    },
    { label: 'Nota Usuário', value: CollectionSortOptions.USER_RATING },
    {
      label: 'Customizada',
      value: CollectionSortOptions.CUSTOM,
      disabled: true,
    },
  ];

  public sortMethod: FormControl = new FormControl(
    CollectionSortOptions.COMPANY
  );

  public companyOptions: string[] = [];

  constructor(
    private store: Store<State>,
    private collectionFiltersService: CollectionFiltersService
  ) {
    this.setupFormListeners();
    this.sortMethod.setValue(this.collectionFiltersService.sortMethod);
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  public setSortMethod(method: CollectionSortOptions) {
    this.sortMethod.setValue(method);
  }

  private setupFormListeners() {
    this.subs.push(
      this.sortMethod.valueChanges.subscribe((val) => {
        if (!val) return;
        this.sorted.emit(val);
        this.collectionFiltersService.sortMethod = val;
        this.clearSortEnabled = val !== CollectionSortOptions.COMPANY;
      })
    );
  }
}
