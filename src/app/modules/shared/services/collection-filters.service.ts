import { Injectable } from '@angular/core';
import { CollectionSortOptions } from 'app/modules/collection/models/collection.models';

@Injectable({
  providedIn: 'root',
})
export class CollectionFiltersService {
  public readonly DEFAULT_SORT = CollectionSortOptions.COMPANY;

  public sortMethod: CollectionSortOptions = this.DEFAULT_SORT;
  public currentFilters: string[] = [];

  constructor() {}
}
