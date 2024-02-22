import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfumeSearchModule } from '../shared/components/perfume-search/perfume-search.module';
import { MaterialModule } from '../shared/material.module';
import { CollectionRoutingModule } from './collection-routing.module';
import { CollectionComponent } from './container/collection.component';
import { CollectionGridComponent } from './components/collection-grid/collection-grid.component';
import { CollectionCardComponent } from './components/collection-card/collection-card.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CollectionRoutingModule,
    MaterialModule,
    PerfumeSearchModule,
  ],
  declarations: [CollectionComponent, CollectionGridComponent, CollectionCardComponent],
  exports: [CollectionComponent],
})
export class CollectionModule {}
