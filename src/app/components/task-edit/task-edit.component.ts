import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ApiStatusEnum, EditResponseInterface, ErrorInterface, TaskInterface } from '../../../types';
import { AbstractComponent } from '../../abstract';
import { LoaderService, TaskService } from '../../services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-task-edit.d-block.container.h-100',
  templateUrl: './task-edit.component.html'
})
export class TaskEditComponent extends AbstractComponent implements OnInit {
  form: FormGroup = null;
  image: File = null;
  imageError: string = null;
  imagePreview: string = null;
  task: TaskInterface = {};

  @ViewChild('imageElement') imageElement: ElementRef;

  constructor(private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private loaderService: LoaderService,
              private router: Router,
              private taskService: TaskService) {
    super();
  }

  get hasImageError(): boolean {
    return Boolean(this.imageError);
  }

  get isEditTask(): boolean {
    return Boolean(this.task.id);
  }

  get isFormValid(): boolean {
    return this.form.valid && Boolean(this.image)
  }

  ngOnInit(): void {
    this.getTask(this.activatedRoute.snapshot.params);
    this.createForm();
  }

  onImageChanged(event: Event): void {
    this.imagePreview = null;
    this.imageError = null;
    this.image = null;
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const image: File = target.files[0];
      const fileReader: FileReader = new FileReader();
      fileReader.onload = ((imageFile: File) => {
        return (event: ProgressEvent) => {
          this.imagePreview = event.target['result'];
          this.changeDetectorRef.detectChanges();
          setTimeout(() => this.validateImage(imageFile));
        }
      })(image) ;
      fileReader.readAsDataURL(image);
    }
    else {
      this.image = null;
    }
  }

  onSubmit(): void {
    if ( Boolean(this.form) ) {
      if ( this.isFormValid ) {
        this.taskService.createTask(this.form.value, this.image)
          .takeUntil(this.destroyed$)
          .subscribe((response: EditResponseInterface) => this.onSubmitSuccess(response));
      }
      else {
        this.validateForm();
      }
    }
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      email: [this.task.email || '', [Validators.required, Validators.email]],
      text: [this.task.text || '', Validators.required],
      username: [this.task.username || '', Validators.required]
    });
    this.changeDetectorRef.detectChanges();
    this.loaderService.loader = false;
  }

  private getTask(params: Params): void {
    if ( params['id'] ) {
      this.task = this.taskService.getTask(+params['id']) || {};
      if ( this.isEditTask ) {
        this.imagePreview = this.task.image_path;
      }
      else {
        this.router.navigate(['..'], {
          queryParamsHandling: 'preserve',
          relativeTo: this.activatedRoute
        });
      }
    }
  }

  private onSubmitSuccess(response: EditResponseInterface): void {
    if ( response.status === ApiStatusEnum.OK ) {
      const navigateCommands: string[] = this.isEditTask ? ['../..'] : ['..'];
      this.router.navigate(navigateCommands, {
        queryParamsHandling: 'preserve',
        relativeTo: this.activatedRoute
      });
    }
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
    this.changeDetectorRef.detectChanges();
  }

  private validateForm(): void {
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
