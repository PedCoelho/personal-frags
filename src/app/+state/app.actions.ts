import { createAction, props } from '@ngrx/store';
import {
  PerfumeTag,
  UserPerfume,
} from 'app/modules/collection/models/collection.models';

export const updateCollection = createAction(
  '[CollectionComponent] Load',
  props<{ collection: UserPerfume[] }>()
);
export const updateTags = createAction(
  '[CollectionComponent] Load Tags',
  props<{ tags: PerfumeTag[] }>()
);
export const removeTag = createAction(
  '[CollectionComponent] Remove Tag',
  props<{ id: string }>()
);
