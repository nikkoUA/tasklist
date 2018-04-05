import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ApiStatusEnum, EditResponseInterface, TaskInterface } from '../../../types';
import { AbstractFormComponent } from '../../abstract';
import { ListService, LoaderService, TaskService } from '../../services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-task-edit.d-block.container.h-100',
  templateUrl: './task-edit.component.html'
})
export class TaskEditComponent extends AbstractFormComponent implements OnInit {
  errorMessage: string = null;
  image: File = null;
  imageError: string = null;
  imagePreview: string = null;
  task: TaskInterface = {};

  @ViewChild('imageElement') imageElement: ElementRef;

  constructor(changeDetectorRef: ChangeDetectorRef,
              formBuilder: FormBuilder,
              listService: ListService,
              loaderService: LoaderService,
              router: Router,
              private taskService: TaskService,
              private activatedRoute: ActivatedRoute) {
    super(changeDetectorRef, formBuilder, listService, loaderService, router);
  }

  get hasImageError(): boolean {
    return Boolean(this.imageError);
  }

  get isEditTask(): boolean {
    return Boolean(this.task.id);
  }

  get isFormValid(): boolean {
    return this.form.valid && this.isImageValid;
  }

  private get isImageValid(): boolean {
    return this.isEditTask || Boolean(this.image);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.taskService.task = null;
  }

  ngOnInit(): void {
    this.getTask(this.activatedRoute.snapshot.params);
    super.ngOnInit();
    this.updatePreviewCache();
    this.setFormListeners();
  }

  onImageChanged(event: Event): void {
    this.imagePreview = null;
    this.imageError = null;
    this.image = null;
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if ( target.files && target.files[0] ) {
      const image: File = target.files[0];
      const fileReader: FileReader = new FileReader();
      fileReader.onload = ((imageFile: File) => {
        return (event: ProgressEvent) => {
          this.imagePreview = event.target['result'];
          this.changeDetectorRef.detectChanges();
          setTimeout(() => this.validateImage(imageFile));
        };
      })(image);
      fileReader.readAsDataURL(image);
    }
    else {
      this.image = null;
    }
  }

  onSubmit(): void {
    if ( Boolean(this.form) ) {
      if ( this.isFormValid ) {
        this.errorMessage = null;
        this.loaderService.loader = true;
        this.submitForm();
      }
      else {
        this.validateForm();
      }
    }
  }

  protected createForm(): void {
    this.form = this.formBuilder.group({
      email: this.task.email || '',
      text: [this.task.text || '', Validators.required],
      username: this.task.username || ''
    });
    if ( this.isEditTask ) {
      this.form.get('email').disable();
      this.form.get('username').disable();
      this.form.addControl('status', this.formBuilder.control(this.task.status !== 0));
    }
    else {
      this.form.get('email').setValidators([Validators.required, Validators.email]);
      this.form.get('username').setValidators(Validators.required);
    }
    this.changeDetectorRef.detectChanges();
    this.loaderService.loader = false;
  }

  private getTask(params: Params): void {
    if ( params['id'] ) {
      this.task = this.listService.getTask(+params['id']) || {};
      if ( this.isEditTask ) {
        this.imagePreview = this.task.image_path;
      }
      else {
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

  private onSubmitNext(response: EditResponseInterface): void {
    if ( response.status === ApiStatusEnum.OK ) {
      this.onSubmitSuccess();
    }
    else {
      this.onSubmitError(response);
    }
    this.loaderService.loader = false;
  }

  private onSubmitError(response: EditResponseInterface): void {
    if ( Boolean(response.message) ) {
      if ( typeof response.message === 'string' ) {
        this.errorMessage = response.message;
      }
      else {
        if ( typeof response.message.image === 'string' ) {
          this.imageError = response.message.image;
          delete response.message.image;
        }
        if ( Object.keys(response.message).length > 0 ) {
          this.form.setErrors(response.message);
        }
      }
      this.changeDetectorRef.detectChanges();
    }
    else {
      this.errorMessage = 'Unexpected error';
    }
  }

  private onSubmitSuccess(): void {
    this.listService.reload = true;
    this.router.navigate(['/list', this.currentPage], {
      queryParamsHandling: 'preserve'
    });
  }

  private setFormListeners(): void {
    this.form.valueChanges
      .subscribe(() => this.updatePreviewCache());
  }

  private submitForm(): void {
    if ( this.isEditTask ) {
      this.taskService.editTask(this.task.id, this.form.value)
        .takeUntil(this.destroyed$)
        .subscribe((response: EditResponseInterface) => this.onSubmitNext(response));
    }
    else {
      this.taskService.createTask(this.form.value, this.image)
        .takeUntil(this.destroyed$)
        .subscribe((response: EditResponseInterface) => this.onSubmitNext(response));
    }
  }

  private updatePreviewCache(): void {
    this.taskService.task = Object.assign({}, this.task, {
      email: this.form.get('email').value,
      image_path: this.imagePreview,
      status: this.isEditTask && this.form.get('status').value ? 10 : 0,
      text: this.form.get('text').value,
      username: this.form.get('username').value
    });
  }

  private validateImage(imageFile: File): void {
    if ( this.imagePreview ) {
      if ( this.imageElement.nativeElement['naturalWidth'] > 320 && this.imageElement.nativeElement['naturalHeight'] > 240 ) {
        this.imageError = 'Allowed image size 320х240px';
      }
      else {
        this.image = imageFile;
      }
    }
    else {
      this.imageError = 'Unsupported file format';
    }
    this.updatePreviewCache();
    this.changeDetectorRef.detectChanges();
  }
}
