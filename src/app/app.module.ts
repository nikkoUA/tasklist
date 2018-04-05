import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import '../rxjs-imports';

import { ListComponent, LoginComponent, PageComponent, RootComponent, TaskEditComponent } from './components';
import { AuthGuard, LoaderService, TaskService, UserService } from './services';
import { RoutingModule } from './routing.module';

@NgModule({
  declarations: [
    ListComponent,
    LoginComponent,
    PageComponent,
    RootComponent,
    TaskEditComponent
  ],
  imports: [
    BrowserModule,
    BsDropdownModule.forRoot(),
    FormsModule,
    HttpClientModule,
    PaginationModule.forRoot(),
    ReactiveFormsModule,
    RoutingModule
  ],
  providers: [
    AuthGuard,
    LoaderService,
    TaskService,
    UserService
  ],
  bootstrap: [RootComponent]
})
export class AppModule {
}
