import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { AbstractComponent } from '../../abstract';
import { TaskService } from '../../services';

@Component({
  selector: 'app-list.container.h-100.d-flex.flex-column.justify-content-start',
  templateUrl: './list.component.html'
})
export class ListComponent extends AbstractComponent implements OnInit {
  currentPage: number = 1;
  itemsPerPage: number = 3;
  errorMessage: string = null;
  totalTasks: number = 0;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private taskService: TaskService) {
    super();
  }

  get showPagination(): boolean {
    return this.totalTasks > this.itemsPerPage;
  }

  ngOnInit(): void {
    this.taskService.currentPage$
      .takeUntil(this.destroyed$)
      .subscribe((page: string) => this.currentPage = +page);
    this.taskService.listError$
      .takeUntil(this.destroyed$)
      .subscribe((error: string) => this.errorMessage = error);
    this.taskService.totalTaskCount$
      .takeUntil(this.destroyed$)
      .subscribe((totalTasks: number) => this.totalTasks = totalTasks);
  }

  onPageChanged(event: PageChangedEvent): void {
    this.router.navigate([event.page], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }
}
