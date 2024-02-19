import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './modules/shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  { path: '**', redirectTo: 'collection', pathMatch: 'full' },
  {
    path: 'collection',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/collection/collection.module').then(
        (m) => m.CollectionModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
