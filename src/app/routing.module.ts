import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  ListComponent,
  LoginComponent,
  PageComponent,
  TaskEditComponent,
  TaskViewComponent
} from './components';
import { AuthGuard } from './services';

const routes: Routes = [
  {
    path: 'create',
    component: TaskEditComponent,
    children: [
      {
        path: 'preview',
        component: TaskViewComponent,
        data: {preview: true}
      }
    ]
  },
  {
    path: 'edit/:id',
    component: TaskEditComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'preview',
        component: TaskViewComponent,
        data: {preview: true}
      }
    ]
  },
  {
    path: 'list',
    component: ListComponent,
    children: [
      {
        path: ':page',
        component: PageComponent,
        children: [
          {
            path: 'view/:id',
            component: TaskViewComponent
          }
        ]
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
