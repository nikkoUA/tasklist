import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import '../rxjs-imports';

import { LayoutComponent, ListComponent, RootComponent } from './components';
import { LoaderService, TaskService } from './services';
import { RoutingModule } from './routing.module';

@NgModule({
  declarations: [
    LayoutComponent,
    ListComponent,
    RootComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    PaginationModule.forRoot(),
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
