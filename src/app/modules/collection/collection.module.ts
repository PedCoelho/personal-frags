import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxColorsModule } from 'ngx-colors';
import { PerfumeGraphModule } from '../perfume-graph/perfume-graph.module';
import { PerfumeSearchModule } from '../shared/components/perfume-search/perfume-search.module';
import { PerfumeStarRatingComponent } from '../shared/components/perfume-star-rating/perfume-star-rating.component';
import { MaterialModule } from '../shared/material.module';
import { CollectionRoutingModule } from './collection-routing.module';
import { CollectionCardComponent } from './components/collection-card/collection-card.component';
import { CollectionFiltersBarComponent } from './components/collection-filters-bar/collection-filters-bar.component';
import { CollectionGridComponent } from './components/collection-grid/collection-grid.component';
import { PerfumeEditModalComponent } from './components/perfume-edit-modal/perfume-edit-modal.component';
import { CollectionComponent } from './container/collection.component';
@NgModule({
  imports: [
    CommonModule,
    CollectionRoutingModule,
    ReactiveFormsModule,
    NgxColorsModule,
    MaterialModule,
    PerfumeSearchModule,
    PerfumeGraphModule,
    PerfumeStarRatingComponent,
  ],
  declarations: [
    CollectionComponent,
    CollectionGridComponent,
    CollectionCardComponent,
    CollectionFiltersBarComponent,
    PerfumeEditModalComponent,
  ],
  exports: [CollectionComponent],
})
export class CollectionModule {}
