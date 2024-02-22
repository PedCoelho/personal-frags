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
}
