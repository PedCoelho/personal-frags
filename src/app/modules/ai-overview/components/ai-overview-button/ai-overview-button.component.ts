import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserPerfume } from 'app/modules/collection/models/collection.models';
import { AiOverviewComponent } from '../../ai-overview.component';

@Component({
  selector: 'ai-overview-button',
  templateUrl: './ai-overview-button.component.html',
  styleUrls: ['./ai-overview-button.component.scss'],
})
export class AiOverviewButtonComponent {
  @Input() disabled: boolean = false;
  @Input() title: string = 'AI Overview';
  @Input() perfume?: UserPerfume;

  constructor(private dialog: MatDialog) {}

  public triggerOverviewModal() {
    if (!this.perfume) return;

    const dialogRef = this.dialog.open(AiOverviewComponent, {
      data: this.perfume,
      width: '70vw',
      height: '50vh',
    });
  }
}
