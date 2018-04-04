import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  ListComponent,
  PageComponent,
  TaskEditComponent
} from './components';

const routes: Routes = [
  {
    path: 'create',
    component: TaskEditComponent
  },
  {
    path: 'list',
    component: ListComponent,
    children: [
      {
        path: ':page',
        component: PageComponent,
      },
      {
        path: '**',
        redirectTo: '1'
      }
    ]
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
