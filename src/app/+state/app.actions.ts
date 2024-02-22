import { createAction, props } from '@ngrx/store';
import { UserPerfume } from 'app/modules/collection/models/collection.models';

export const updateCollection = createAction(
  '[CollectionComponent] Load',
  props<{ collection: UserPerfume[] }>()
);
