import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  MetaReducer,
  createReducer,
  on,
} from '@ngrx/store';
import { UserPerfume } from 'app/modules/collection/models/collection.models';
import { updateCollection } from './app.actions';

export interface State {
  collection: CollectionState;
}

export interface CollectionState {
  collection: UserPerfume[];
}

export const initialState: CollectionState = {
  collection: [],
};

export const collectionReducer: ActionReducer<CollectionState> = createReducer(
  initialState,
  on(updateCollection, (state, { collection }) => ({ ...state, collection }))
);

export const reducers: ActionReducerMap<State> = {
  collection: collectionReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
