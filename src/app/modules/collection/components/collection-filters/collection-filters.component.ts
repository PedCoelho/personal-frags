import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from 'app/+state/app.reducers';
import { CollectionFiltersService } from 'app/modules/shared/services/collection-filters.service';
import { Subscription } from 'rxjs';
import { CollectionFilterOptions } from '../../models/collection.models';

@Component({
  selector: 'collection-filters',
  templateUrl: './collection-filters.component.html',
  styleUrls: ['./collection-filters.component.scss'],
})
export class CollectionFiltersComponent implements OnDestroy {
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

  public companyFilter: FormControl = new FormControl([]);

  public companyOptions: string[] = [];

  constructor(
    private store: Store<State>,
    private collectionFiltersService: CollectionFiltersService
  ) {
    this.getCompanyFilterOptions();
    this.setupFormListeners();
    this.companyFilter.setValue(this.collectionFiltersService.currentFilters);
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  private setupFormListeners() {
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
