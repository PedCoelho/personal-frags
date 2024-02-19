import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FirebaseUIModule } from 'firebaseui-angular';
import { MaterialModule } from '../shared/material.module';
import { CollectionRoutingModule } from './collection-routing.module';
import { CollectionComponent } from './container/collection.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    CollectionRoutingModule,
    FirebaseUIModule,
  ],
  declarations: [CollectionComponent],
  exports: [CollectionComponent],
})
export class CollectionModule {}
