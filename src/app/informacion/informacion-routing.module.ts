import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { InformacionPage } from './informacion.page';

const routes: Routes = [
  {
    path: '',
    component: InformacionPage
  },
  {
    path: 'home',
    redirectTo: '/home'
  },
  {
    path: 'login',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformacionPageRoutingModule {}
