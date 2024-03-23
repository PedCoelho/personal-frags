import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { State } from 'app/+state/app.reducers';
import { NotificationService } from 'app/modules/shared/services/notification.service';
import { Observable, Subscription, finalize, map } from 'rxjs';
import {
  PerfumeAccord,
  PerfumeNote,
  PerfumeTag,
  UserPerfume,
} from '../../models/collection.models';
import { CollectionService } from '../../services/collection.service';
import { PerfumeEditModalComponent } from '../perfume-edit-modal/perfume-edit-modal.component';

@Component({
  selector: 'collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss'],
})
export class CollectionCardComponent implements OnDestroy {
  @ViewChild('deleteWarningDialog', { read: TemplateRef })
  deleteWarningDialog!: TemplateRef<any>;

  @Input()
  set perfume(perfume: UserPerfume) {
    this._perfume = perfume;
    this.tags = this.getTags(perfume.user_tags as string[]);
    this.perfumeNotes = this.mapPerfumeNotes(perfume);
  }
  get perfume() {
    return this._perfume;
  }
  @Output('remove') removeActionClicked = new EventEmitter<UserPerfume>();
  @Output('updated') updated = new EventEmitter();

  public perfumeNotes: Array<[string, PerfumeNote[]]> = [];
  public tags!: Observable<PerfumeTag[]>;

  private _perfume!: UserPerfume;
  private subs: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private collectionService: CollectionService,
    private notification: NotificationService,
    private store: Store<State>
  ) {}

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
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
        this.updated.emit();
      });
    this.subs.push(sub);
  }

  public trackTag: TrackByFunction<PerfumeTag> = (index, item) => item.id;
  public trackChord: TrackByFunction<PerfumeAccord> = (index, item) =>
    item.name;
  public trackNote: TrackByFunction<PerfumeNote> = (index, item) => item.link;

  private mapPerfumeNotes(perfume: UserPerfume) {
    return Object.entries(perfume.notes).reverse();
  }

  private getTags(user_tags: string[]): Observable<PerfumeTag[]> {
    return this.store
      .select('collection', 'tags')
      .pipe(map((tags) => tags.filter((tag) => user_tags?.includes(tag.id!))));
  }
}
