import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TaskInterface } from '../../../types';
import { AbstractComponent } from '../../abstract';
import { LoaderService, TaskService, UserService } from '../../services';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-page.d-block.h-100.p-3',
  templateUrl: './page.component.html'
})
export class PageComponent extends AbstractComponent implements OnInit {
  tasks: TaskInterface[] = [];

  private queryParams: Params = {};

  constructor(private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private loaderService: LoaderService,
              private router: Router,
              private taskService: TaskService,
              private userService: UserService) {
    super();
  }

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn;
  }

  get hasTasks(): boolean {
    return this.tasks.length > 0;
  }

  ngOnInit(): void {
    this.makeRequest(this.activatedRoute.snapshot.params, this.activatedRoute.snapshot.queryParams);
    this.activatedRoute.params
      .takeUntil(this.destroyed$)
      .subscribe((params: Params) => this.makeRequest(params, this.activatedRoute.snapshot.queryParams));
    this.activatedRoute.queryParams
      .takeUntil(this.destroyed$)
      .subscribe((queryParams: Params) => this.makeRequest(this.activatedRoute.snapshot.params, queryParams));
  }

  getSortQueryParams(field: string): Params {
    const queryParams: Params = Object.assign({}, this.queryParams);
    if ( queryParams.sort_field === field || (!queryParams.sort_field && field === 'username') ) {
      queryParams.sort_direction = queryParams.sort_direction === 'desc' ? 'asc' : 'desc';
    }
    else {
      queryParams.sort_field = field;
    }
    return queryParams
  }

  onTaskClick(task: TaskInterface): void {
    this.router.navigate(['view', task.id], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }

  private makeRequest(params: Params, queryParams: Params): void {
    this.loaderService.loader = true;
    this.queryParams = queryParams;
    this.taskService.getList(Object.assign({}, params, queryParams))
      .takeUntil(this.destroyed$)
      .subscribe((tasks: TaskInterface[]) => {
        const page: number = +params['page'];
        if ( tasks.length === 0 && page > 1 ) {
          this.router.navigate(['..', `${page - 1}`], {
            queryParamsHandling: 'preserve',
            relativeTo: this.activatedRoute
          });
        }
        else {
          this.tasks = tasks;
          this.loaderService.loader = false;
          this.changeDetectorRef.detectChanges();
        }
      });
  }
}
