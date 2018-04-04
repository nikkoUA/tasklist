import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  LayoutComponent,
  ListComponent,
} from './components';

const routes: Routes = [
  {
    path: 'list',
    component: LayoutComponent,
    children: [
      {
        path: ':page',
        component: ListComponent
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
