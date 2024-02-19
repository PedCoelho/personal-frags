import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { PerfumeSearchComponent } from './perfume-search.component';

@NgModule({
  declarations: [PerfumeSearchComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  exports: [PerfumeSearchComponent],
})
export class PerfumeSearchModule {}
