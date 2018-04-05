import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { AbstractComponent } from '../../abstract';
import { LoaderService, TaskService, UserService } from '../../services';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-list.container.h-100.d-flex.flex-column.justify-content-start',
  templateUrl: './list.component.html'
})
export class ListComponent extends AbstractComponent implements OnInit {
  itemsPerPage: number = 3;
  errorMessage: string = null;

  constructor(private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private loaderService: LoaderService,
              private router: Router,
              private taskService: TaskService,
              private userService: UserService) {
    super();
  }

  get currentPage(): number {
    return +this.taskService.currentPage;
  }

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn;
  }

  get showPagination(): boolean {
    return this.totalTasks > this.itemsPerPage;
  }

  get totalTasks(): number {
    return this.taskService.totalTaskCount;
  }

  ngOnInit(): void {
    this.taskService.listError$
      .takeUntil(this.destroyed$)
      .subscribe((error: string) => this.errorMessage = error);
  }

  onClickLogout(): void {
    this.loaderService.loader = true;
    this.userService.logoutAction()
      .takeUntil(this.destroyed$)
      .subscribe(() => this.loaderService.loader = false);
  }

  onPageChanged(event: PageChangedEvent): void {
    this.router.navigate([event.page], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }
}
