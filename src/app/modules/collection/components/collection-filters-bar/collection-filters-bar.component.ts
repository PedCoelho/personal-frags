import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from 'app/+state/app.reducers';
import { CollectionFiltersService } from 'app/modules/shared/services/collection-filters.service';
import { Subscription } from 'rxjs';
import {
  CollectionFilterOptions,
  CollectionSortOptions,
} from '../../models/collection.models';

@Component({
  selector: 'collection-filters-bar',
  templateUrl: './collection-filters-bar.component.html',
  styleUrls: ['./collection-filters-bar.component.scss'],
})
export class CollectionFiltersBarComponent implements OnDestroy {
  @Output() sorted = new EventEmitter<CollectionSortOptions>();
  @Output('company-filtered') filterByCompany = new EventEmitter<string[]>();
  @Output('filters-cleared') filtersCleared = new EventEmitter();

  public clearFiltersEnabled: boolean = false;
  public clearSortEnabled = false;

  public readonly subs: Subscription[] = [];

  //review currently unused
  public readonly filterOptions: {
    label: string;
    value: CollectionFilterOptions;
  }[] = [
    { label: 'Empresa', value: CollectionFilterOptions.COMPANY },
    { label: 'Perfume', value: CollectionFilterOptions.PERFUME },
    { label: 'Perfumista', value: CollectionFilterOptions.PERFUME },
  ];

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
  public companyFilter: FormControl = new FormControl([]);

  public companyOptions: string[] = [];

  constructor(
    private store: Store<State>,
    private collectionFiltersService: CollectionFiltersService
  ) {
    this.getCompanyFilterOptions();
    this.setupFormListeners();
    this.sortMethod.setValue(this.collectionFiltersService.sortMethod);
    this.companyFilter.setValue(this.collectionFiltersService.currentFilters);
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
        this.clearSortEnabled =
          val === CollectionSortOptions.CUSTOM ? true : false;
      })
    );

    this.subs.push(
      this.companyFilter.valueChanges.subscribe((val) => {
        if (val.length) {
          this.filterByCompany.emit(val);
          this.collectionFiltersService.currentFilters = val;
          this.clearFiltersEnabled = true;
        } else {
          this.filtersCleared.emit();
          this.collectionFiltersService.currentFilters = [];
          this.clearFiltersEnabled = false;
        }
      })
    );
  }

  private getCompanyFilterOptions() {
    this.subs.push(
      this.store.select('collection').subscribe(({ collection }) => {
        this.companyOptions = [
          ...new Set(collection.map((perfume) => perfume.company)),
        ];
      })
    );
  }
}
