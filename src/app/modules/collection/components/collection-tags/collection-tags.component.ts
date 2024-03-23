import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { Subscription, finalize } from 'rxjs';
import {
  PerfumeTag,
  ownershipStatusOptions,
} from '../../models/collection.models';
import { CollectionService } from '../../services/collection.service';

@Component({
  selector: 'collection-tags',
  templateUrl: './collection-tags.component.html',
  styleUrls: ['./collection-tags.component.scss'],
})
export class CollectionTagsComponent {
  @Output() confirmed = new EventEmitter<PerfumeTag[]>();

  public loading = false;

  public perfumeForm = this.formBuilder.nonNullable.group({
    user_tags: new FormArray<
      FormGroup<{
        label: FormControl<string | null>;
        color: FormControl<string | null>;
        id: FormControl<string | null>;
      }>
    >([]),
  });

  public readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public readonly ownershipOptions = ownershipStatusOptions;
  private subs: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private collectionService: CollectionService
  ) {
    this.perfumeForm.markAsPristine();
  }

  public pickTagColor(val: string, i: number) {
    const control =
      this.perfumeForm.controls['user_tags'].at(i).controls['color'];
    control.setValue(val);
    this.perfumeForm.markAsDirty();
  }

  handleConfirm() {
    const tags = this.perfumeForm.value.user_tags as PerfumeTag[];
    this.loading = true;
    this.subs.push(
      this.collectionService
        .setTags(tags)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(() => {
          this.confirmed.emit(tags);
        })
    );
  }

  getTags(): void {
    this.loading = true;
    this.subs.push(
      this.collectionService
        .getTags()
        .pipe(finalize(() => (this.loading = false)))
        .subscribe((tags) =>
          tags.forEach((tag) => {
            this.perfumeForm.controls['user_tags'].push(
              new FormGroup({
                label: new FormControl(tag.label ?? ''),
                color: new FormControl(tag.color ?? ''),
                id: new FormControl(tag.id ?? ''),
              })
            );
          })
        )
    );
  }

  addTag(event: MatChipInputEvent): void {
    console.log(event.value);
    const value = (event.value || '').trim().toLowerCase();

    // Add our perfume
    if (value) {
      (this.perfumeForm.controls['user_tags'] as FormArray).push(
        new FormGroup({
          label: new FormControl(value),
          color: new FormControl(''),
          id: new FormControl(crypto.randomUUID()),
        })
      );
      this.perfumeForm.markAsDirty();
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeTag(index: number): void {
    const tag = this.perfumeForm.controls['user_tags'].at(index).value;
    if (tag.id) {
      this.handleDBRemoval(index);
    } else {
      this.perfumeForm.controls['user_tags'].removeAt(index);
      this.perfumeForm.markAsDirty();
    }
  }

  handleDBRemoval(index: number) {
    this.loading = true;

    const tag = this.perfumeForm.controls['user_tags'].at(index).value;
    this.subs.push(
      this.collectionService
        .deleteTag(tag.id!)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(() => {
          console.log('tag deleted', tag.id);
          this.perfumeForm.controls['user_tags'].removeAt(index);
          this.perfumeForm.markAsDirty();
        })
    );
  }

  editTag(index: number, event: MatChipEditedEvent) {
    const value = event.value.trim().toLowerCase();

    console.log(index);

    // Remove tag if it no longer has a name
    if (!value) {
      return this.removeTag(index);
    }

    // Edit existing tag
    (this.perfumeForm.controls['user_tags'] as FormArray)
      .at(index)
      .patchValue({ label: value });

    this.perfumeForm.markAsDirty();
  }
}
