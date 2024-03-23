import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { State } from 'app/+state/app.reducers';
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

  public tagOptions = this.store.select('collection', 'tags');

  public perfumeForm = this.formBuilder.nonNullable.group({
    user_tags: [],
    user_owned: [],
    user_price: [],
    user_rating: [],
  });

  public readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public readonly ownershipOptions = ownershipStatusOptions;

  constructor(
    @Inject(MAT_DIALOG_DATA) public perfume: UserPerfume,
    private formBuilder: FormBuilder,
    private store: Store<State>
  ) {
    //@ts-ignore
    this.perfumeForm.patchValue(perfume);
    this.perfumeForm.markAsPristine();

    this.tagOptions.subscribe((tags) => console.log(tags));
  }
}
