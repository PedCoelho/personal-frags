import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, finalize } from 'rxjs';
import { UserPerfume } from '../collection/models/collection.models';
import { AIOverviewService } from './services/ai-overview.service';

@Component({
  selector: 'ai-overview',
  templateUrl: './ai-overview.component.html',
  styleUrls: ['./ai-overview.component.scss'],
})
export class AiOverviewComponent implements OnInit, OnDestroy {
  public loading = true;
  public overview$?: Observable<any>;

  constructor(
    private aiOverviewService: AIOverviewService,
    @Inject(MAT_DIALOG_DATA) public perfume: UserPerfume
  ) {}

  ngOnInit(): void {
    this.setupOverview(this.perfume.id);
  }

  private setupOverview(id: string) {
    this.overview$ = this.aiOverviewService
      .getAIOverview(id)
      .pipe(finalize(() => (this.loading = false)));
  }

  ngOnDestroy(): void {
    // this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
