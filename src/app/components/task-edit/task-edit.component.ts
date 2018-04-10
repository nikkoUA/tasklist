import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Ng2ImgMaxService } from 'ng2-img-max';

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
  imagePath: string = null;
  task: TaskInterface = {};

  constructor(changeDetectorRef: ChangeDetectorRef,
              formBuilder: FormBuilder,
              listService: ListService,
              loaderService: LoaderService,
              router: Router,
              private domSanitizer: DomSanitizer,
              private ng2ImgMaxService: Ng2ImgMaxService,
              private taskService: TaskService,
              private activatedRoute: ActivatedRoute) {
    super(changeDetectorRef, formBuilder, listService, loaderService, router);
  }

  get hasImageError(): boolean {
    return Boolean(this.imageError);
  }

  get imagePreviewSrc(): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(this.imagePath);
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
    this.image = null;
    this.imageError = null;
    this.imagePath = null;
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if ( target.files && target.files[0] ) {
      const file: File = target.files[0];
      this.ng2ImgMaxService.resizeImage(file, 320, 240)
        .takeUntil(this.destroyed$)
        .subscribe(
          (uploadedImage: Blob) => {
            this.image = new File([uploadedImage], file.name);
            this.previewImage();
          },
          () => this.imageError = 'Unsupported file format'
        );
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
        this.imagePath = this.task.image_path;
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

  private previewImage(): void {
    const fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(this.image);
    fileReader.onload = () => {
      this.imagePath = fileReader.result;
      this.updatePreviewCache();
      this.changeDetectorRef.detectChanges();
    };
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
      image_path: this.imagePath,
      status: this.isEditTask && this.form.get('status').value ? 10 : 0,
      text: this.form.get('text').value,
      username: this.form.get('username').value
    });
  }
}
