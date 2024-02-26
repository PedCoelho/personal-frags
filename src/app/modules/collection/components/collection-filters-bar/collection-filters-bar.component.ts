import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
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
  @Input('show-clear') clearEnabled = false;
  @Output() sorted = new EventEmitter<CollectionSortOptions>();

  public readonly subs: Subscription[] = [];

  public readonly filterOptions: {
    label: string;
    value: CollectionFilterOptions;
  }[] = [
    { label: 'Empresa', value: CollectionFilterOptions.COMPANY },
    { label: 'Perfume', value: CollectionFilterOptions.PERFUME },
  ];

  public readonly sortOptions: {
    label: string;
    value: CollectionSortOptions;
    disabled?: boolean;
  }[] = [
    { label: 'Empresa', value: CollectionSortOptions.COMPANY },
    { label: 'Perfume', value: CollectionSortOptions.PERFUME },
    {
      label: 'Customizada',
      value: CollectionSortOptions.CUSTOM,
      disabled: true,
    },
  ];

  public sortMethod: FormControl = new FormControl(
    CollectionSortOptions.COMPANY
  );

  constructor() {
    this.subs.push(
      this.sortMethod.valueChanges.subscribe((val) => {
        if (val) this.sorted.emit(val);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
