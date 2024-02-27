import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/modules/shared/services/notification.service';
import { Subscription, finalize } from 'rxjs';
import { UserPerfume } from '../../models/collection.models';
import { CollectionService } from '../../services/collection.service';
import { PerfumeEditModalComponent } from '../perfume-edit-modal/perfume-edit-modal.component';

@Component({
  selector: 'collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss'],
})
export class CollectionCardComponent {
  @ViewChild('deleteWarningDialog', { read: TemplateRef })
  deleteWarningDialog!: TemplateRef<any>;

  @Input() perfume!: UserPerfume;
  @Output('remove') removeActionClicked = new EventEmitter<UserPerfume>();

  private subs: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private collectionService: CollectionService,
    private notification: NotificationService
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(PerfumeEditModalComponent, {
      data: this.perfume,
    });

    const sub = dialogRef
      .afterClosed()
      .subscribe((value: Partial<UserPerfume>) => {
        console.log('The dialog was closed');
        if (!value) return;
        else this.handleEditingConfirm(value);
      });

    this.subs.push(sub);
  }

  public toggleAccords(perfume: UserPerfume) {
    // perfume.showNotes = false;
    perfume.showAccords = !perfume.showAccords;
  }

  public toggleNotes(perfume: UserPerfume) {
    // perfume.showAccords = false;
    perfume.showNotes = !perfume.showNotes;
  }

  public getPerfumeUrl(perfume: UserPerfume) {
    return `https://www.fragrantica.com.br/perfume/${perfume.company.replaceAll(
      ' ',
      '-'
    )}/${perfume.name.replaceAll(' ', '-')}-${perfume.id}.html`;
  }

  public edit(perfume: UserPerfume) {
    this.openDialog();
  }

  public handleEditingConfirm(value: Partial<UserPerfume>) {
    this.perfume.loading = true;
    const sub = this.collectionService
      .updatePerfume(this.perfume.id, value)
      .pipe(finalize(() => (this.perfume.loading = false)))
      .subscribe(() => {
        this.notification.success('Perfume atualizado com sucesso');
        this.perfume = { ...this.perfume, ...value };
      });
    this.subs.push(sub);
  }
}
