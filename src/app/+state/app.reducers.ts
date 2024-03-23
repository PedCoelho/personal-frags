import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  MetaReducer,
  createReducer,
  on,
} from '@ngrx/store';
import {
  PerfumeTag,
  UserPerfume,
} from 'app/modules/collection/models/collection.models';
import { removeTag, updateCollection, updateTags } from './app.actions';

export interface State {
  collection: CollectionState;
}

export interface CollectionState {
  collection: UserPerfume[];
  tags: PerfumeTag[];
}

export const initialState: CollectionState = {
  collection: [],
  tags: [],
};

export const collectionReducer: ActionReducer<CollectionState> = createReducer(
  initialState,
  on(updateCollection, (state, { collection }) => ({ ...state, collection })),
  on(updateTags, (state, { tags }) => ({ ...state, tags })),
  on(removeTag, ({ tags, ...state }, { id }) => ({
    ...state,
    tags: tags.filter((tag) => tag.id !== id),
  }))
);

export const reducers: ActionReducerMap<State> = {
  collection: collectionReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
