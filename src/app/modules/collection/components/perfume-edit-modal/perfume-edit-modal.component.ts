import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormArray, FormControl, UntypedFormBuilder } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  UserPerfume,
  ownershipStatusOptions,
} from '../../models/collection.models';

@Component({
  selector: 'perfume-edit-modal',
  templateUrl: './perfume-edit-modal.component.html',
  styleUrls: ['./perfume-edit-modal.component.scss'],
})
export class PerfumeEditModalComponent {
  @Output() confirmed = new EventEmitter<Partial<UserPerfume>>();

  public perfumeForm = this.formBuilder.group({
    user_tags: new FormArray([]),
    user_owned: [null],
    user_price: [null],
    user_rating: [null],
  });

  public readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public readonly ownershipOptions = ownershipStatusOptions;

  constructor(
    @Inject(MAT_DIALOG_DATA) public perfume: UserPerfume,
    private formBuilder: UntypedFormBuilder
  ) {
    this.perfumeForm.patchValue(perfume);
    perfume.user_tags?.forEach((tag) =>
      (this.perfumeForm.controls['user_tags'] as FormArray).push(
        new FormControl(tag)
      )
    );
    this.perfumeForm.markAsPristine();
    console.log(this.perfumeForm.value, this.perfumeForm.valid);
  }

  addTag(event: MatChipInputEvent): void {
    console.log(event.value);
    const value = (event.value || '').trim();

    // Add our perfume
    if (value) {
      (this.perfumeForm.controls['user_tags'] as FormArray).push(
        new FormControl({
          label: value,
        })
      );
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeTag(index: number): void {
    (this.perfumeForm.controls['user_tags'] as FormArray).removeAt(index);
  }

  editTag(index: number, event: MatChipEditedEvent) {
    const value = event.value.trim();

    console.log(index);

    // Remove tag if it no longer has a name
    if (!value) {
      return this.removeTag(index);
    }

    // Edit existing tag
    (this.perfumeForm.controls['user_tags'] as FormArray)
      .at(index)
      .patchValue({ label: value });
  }
}
