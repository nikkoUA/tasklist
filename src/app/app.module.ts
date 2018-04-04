import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import '../rxjs-imports';

import { ListComponent, PageComponent, RootComponent, TaskEditComponent } from './components';
import { LoaderService, TaskService } from './services';
import { RoutingModule } from './routing.module';

@NgModule({
  declarations: [
    ListComponent,
    PageComponent,
    RootComponent,
    TaskEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    PaginationModule.forRoot(),
    ReactiveFormsModule,
    RoutingModule
  ],
  providers: [
    LoaderService,
    TaskService
  ],
  bootstrap: [RootComponent]
})
export class AppModule {
}
