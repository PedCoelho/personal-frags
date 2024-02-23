import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TippyDirective } from './directives/tippy.directive';
import { ReversePipe } from './pipes/reverse.pipe';
import { SortPipe } from './pipes/sort.pipe';

const modules = [
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatDividerModule,
  MatIconModule,
  MatTooltipModule,
  TippyDirective,
  ReversePipe,
  SortPipe,
];

@NgModule({
  imports: modules,
  exports: modules,
  declarations: [],
})
export class MaterialModule {}
