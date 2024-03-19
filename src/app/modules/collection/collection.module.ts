import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxColorsModule } from 'ngx-colors';
import { PerfumeSearchModule } from '../shared/components/perfume-search/perfume-search.module';
import { PerfumeStarRatingComponent } from '../shared/components/perfume-star-rating/perfume-star-rating.component';
import { MaterialModule } from '../shared/material.module';
import { CollectionRoutingModule } from './collection-routing.module';
import { CollectionCardComponent } from './components/collection-card/collection-card.component';
import { CollectionFiltersComponent } from './components/collection-filters/collection-filters.component';
import { CollectionGridComponent } from './components/collection-grid/collection-grid.component';
import { PerfumeEditModalComponent } from './components/perfume-edit-modal/perfume-edit-modal.component';
import { CollectionComponent } from './container/collection.component';
import { CollectionSortComponent } from './components/collection-sort/collection-sort.component';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CollectionRoutingModule,
    MaterialModule,
    PerfumeSearchModule,
    NgxColorsModule,
    PerfumeStarRatingComponent,
  ],
  declarations: [
    CollectionComponent,
    CollectionGridComponent,
    CollectionCardComponent,
    CollectionFiltersComponent,
    CollectionSortComponent,
    PerfumeEditModalComponent,
  ],
  exports: [CollectionComponent],
})
export class CollectionModule {}
