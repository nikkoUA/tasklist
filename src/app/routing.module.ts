import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  ListComponent,
  LoginComponent,
  PageComponent,
  TaskEditComponent
} from './components';
import { AuthGuard } from './services';

const routes: Routes = [
  {
    path: 'create',
    component: TaskEditComponent
  },
  {
    path: 'edit/:id',
    component: TaskEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'list',
    component: ListComponent,
    children: [
      {
        path: ':page',
        component: PageComponent
      },
      {
        path: '**',
        redirectTo: '1'
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: 'list'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class RoutingModule {
}
