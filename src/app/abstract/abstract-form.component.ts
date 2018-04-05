import { ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorInterface } from 'types';

import { AbstractComponent } from './abstract.component';
import { LoaderService, TaskService } from '../services';

export abstract class AbstractFormComponent extends AbstractComponent implements OnInit {
  currentPage: string = '1';
  form: FormGroup = null;

  constructor(protected changeDetectorRef: ChangeDetectorRef,
              protected formBuilder: FormBuilder,
              protected loaderService: LoaderService,
              protected router: Router,
              protected taskService: TaskService) {
    super();
  }

  ngOnInit(): void {
    this.currentPage = this.taskService.currentPage;
    this.createForm();
  }

  abstract onSubmit(): void;

  protected abstract createForm(): void;

  protected validateForm(): void {
    const errors: ErrorInterface = {};
    Object.keys(this.form.controls).forEach((field: string) => {
      if ( !this.form.get(field).valid ) {
        errors[field] = 'This field is required'
      }
    });
    if ( Object.keys(errors).length > 0 ) {
      this.form.setErrors(errors);
    }
  }
}
