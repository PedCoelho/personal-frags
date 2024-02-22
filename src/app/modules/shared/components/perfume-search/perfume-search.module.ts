import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { ArrayFromNumberPipe } from '../../pipes/array-from-number.pipe';
import { PerfumeSearchResultComponent } from '../perfume-search-result/perfume-search-result.component';
import { PerfumeSearchComponent } from './perfume-search.component';

@NgModule({
  declarations: [PerfumeSearchComponent, PerfumeSearchResultComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    ArrayFromNumberPipe,
  ],
  exports: [PerfumeSearchComponent],
})
export class PerfumeSearchModule {}
