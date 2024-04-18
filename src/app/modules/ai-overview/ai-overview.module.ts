import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../shared';
import { AiOverviewComponent } from './ai-overview.component';
import { AiOverviewButtonComponent } from './components/ai-overview-button/ai-overview-button.component';

@NgModule({
  declarations: [AiOverviewComponent, AiOverviewButtonComponent],
  imports: [CommonModule, MaterialModule],
  exports: [AiOverviewComponent, AiOverviewButtonComponent],
})
export class AIOverviewModule {}
