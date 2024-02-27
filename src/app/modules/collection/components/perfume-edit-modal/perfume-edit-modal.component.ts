import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

  public perfumeForm = this.formBuilder.nonNullable.group({
    user_tags: new FormArray<
      FormGroup<{ label: FormControl<string>; color: FormControl<string> }>
    >([]),
    user_owned: [],
    user_price: [],
    user_rating: [],
  });

  public readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public readonly ownershipOptions = ownershipStatusOptions;

  constructor(
    @Inject(MAT_DIALOG_DATA) public perfume: UserPerfume,
    private formBuilder: FormBuilder
  ) {
    //@ts-ignore
    this.perfumeForm.patchValue(perfume);
    perfume.user_tags?.forEach((tag) =>
      (this.perfumeForm.controls['user_tags'] as FormArray).push(
        new FormGroup({
          label: new FormControl(tag.label),
          color: new FormControl(tag.color),
        })
      )
    );
    this.perfumeForm.markAsPristine();
    console.log(this.perfumeForm.value, this.perfumeForm.valid);
  }

  public pickTagColor(val: string, i: number) {
    const control =
      this.perfumeForm.controls['user_tags'].at(i).controls['color'];
    control.setValue(val);
    this.perfumeForm.markAsDirty();
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
        })
      );
      this.perfumeForm.markAsDirty();
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeTag(index: number): void {
    this.perfumeForm.controls['user_tags'].removeAt(index);
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
