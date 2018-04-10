import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { TaskInterface } from '../../../types';
import { ListService, TaskService } from '../../services';

@Component({
  selector: 'app-task-view.d-block.position-fixed.h-100.p-3',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
  backRouterLink: string[];
  currentPage: string = '1';
  isPreview: boolean = false;
  task: TaskInterface = {};

  constructor(private activatedRoute: ActivatedRoute,
              private listService: ListService,
              private domSanitizer: DomSanitizer,
              private router: Router,
              private taskService: TaskService) {
  }

  get imagePreviewSrc(): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(this.task.image_path);
  }

  get isCompletedTask(): boolean {
    return this.task.status === 10;
  }


  get isExistingTask(): boolean {
    return Boolean(this.task.id);
  }

  ngOnInit(): void {
    this.isPreview = this.activatedRoute.snapshot.data.preview || false;
    this.currentPage = this.listService.currentPage || '1';
    this.getTask();
  }

  private getTask(): void {
    if ( this.isPreview ) {
      this.task = this.taskService.task;
      if ( !this.task ) {
        this.onGetDataError();
      }
      else {
        this.backRouterLink = this.isExistingTask ? ['/edit', this.task.id.toString()] : ['/create'];
      }
    }
    else {
      this.backRouterLink = ['/list', this.currentPage];
      this.task = this.listService.getTask(+this.activatedRoute.snapshot.params['id']) || {};
      if ( !this.isExistingTask ) {
        this.onGetDataError();
      }
    }
  }

  private onGetDataError(): void {
    console.warn('Unexpected error while getting Task data');
    this.router.navigate(['/'], {
      queryParamsHandling: 'preserve'
    });
  }
}
