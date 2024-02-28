import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/modules/shared/services/notification.service';
import { Subscription, finalize } from 'rxjs';
import {
  PerfumeAccord,
  PerfumeNote,
  PerfumeTag,
  UserPerfume,
} from '../../models/collection.models';
import { CollectionService } from '../../services/collection.service';
import { PerfumeEditModalComponent } from '../perfume-edit-modal/perfume-edit-modal.component';
import { ReversePipe } from './../../../shared/pipes/reverse.pipe';

@Component({
  selector: 'collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss'],
})
export class CollectionCardComponent implements OnInit, OnDestroy {
  @ViewChild('deleteWarningDialog', { read: TemplateRef })
  deleteWarningDialog!: TemplateRef<any>;

  @Input() perfume!: UserPerfume;
  @Output('remove') removeActionClicked = new EventEmitter<UserPerfume>();

  public perfumeNotes: Array<[string, PerfumeNote[]]> = [];

  private subs: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private collectionService: CollectionService,
    private notification: NotificationService
  ) {}

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    //map perfume notes to usable format
    this.mapPerfumeNotes();
  }

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
      .pipe(
        finalize(() => {
          this.perfume.loading = false;
        })
      )
      .subscribe(() => {
        this.notification.success('Perfume atualizado com sucesso');
        this.perfume = { ...this.perfume, ...value };
      });
    this.subs.push(sub);
  }

  public trackTag: TrackByFunction<PerfumeTag> = (index, item) => item.label;
  public trackChord: TrackByFunction<PerfumeAccord> = (index, item) =>
    item.name;
  public trackNote: TrackByFunction<PerfumeNote> = (index, item) => item.link;

  private mapPerfumeNotes() {
    new ReversePipe()
      .transform(Object.entries(this.perfume.notes))
      .forEach(([category, notes]: [string, PerfumeNote[]]) => {
        this.perfumeNotes.push([category, notes]);
      });
  }
}
