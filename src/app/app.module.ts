import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import '../rxjs-imports';

import { ListComponent, LoginComponent, PageComponent, RootComponent, TaskEditComponent, TaskViewComponent } from './components';
import { AuthGuard, ListService, LoaderService, TaskService, UserService } from './services';
import { RoutingModule } from './routing.module';

@NgModule({
  declarations: [
    ListComponent,
    LoginComponent,
    PageComponent,
    RootComponent,
    TaskEditComponent,
    TaskViewComponent
  ],
  imports: [
    BrowserModule,
    BsDropdownModule.forRoot(),
    FormsModule,
    HttpClientModule,
    Ng2ImgMaxModule,
    PaginationModule.forRoot(),
    ReactiveFormsModule,
    RoutingModule
  ],
  providers: [
    AuthGuard,
    ListService,
    LoaderService,
    TaskService,
    UserService
  ],
  bootstrap: [RootComponent]
})
export class AppModule {
}
