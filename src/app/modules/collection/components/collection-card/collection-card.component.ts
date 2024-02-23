import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserPerfume } from '../../models/collection.models';

@Component({
  selector: 'collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss'],
})
export class CollectionCardComponent {
  @Input() perfume?: UserPerfume;
  @Output('remove') removeActionClicked = new EventEmitter<UserPerfume>();

  public toggleAccords(perfume: UserPerfume) {
    // perfume.showNotes = false;
    perfume.showAccords = !perfume.showAccords;
  }

  public toggleNotes(perfume: UserPerfume) {
    // perfume.showAccords = false;
    perfume.showNotes = !perfume.showNotes;
  }
}
