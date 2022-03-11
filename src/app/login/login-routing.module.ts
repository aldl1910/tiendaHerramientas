import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
    path: 'home',
    redirectTo: '/home'
  },
  {
    path: 'login',
    redirectTo: '/login'
  },
  {
    path: 'informacion',
    redirectTo: '/informacion'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}