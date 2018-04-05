import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AbstractFormComponent } from '../../abstract';
import { LoaderService, ListService, UserService } from '../../services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login.d-block.container.h-100',
  templateUrl: './login.component.html'
})
export class LoginComponent extends AbstractFormComponent implements OnInit {

  constructor(changeDetectorRef: ChangeDetectorRef,
              formBuilder: FormBuilder,
              listService: ListService,
              loaderService: LoaderService,
              router: Router,
              private userService: UserService) {
    super(changeDetectorRef, formBuilder, listService, loaderService, router);
  }

  onSubmit(): void {
    if ( Boolean(this.form) ) {
      if ( this.form.valid ) {
        this.loaderService.loader = true;
        this.userService.loginAction(this.form.get('username').value, this.form.get('password').value)
          .takeUntil(this.destroyed$)
          .subscribe(
            (success: boolean) => this.onLoginNext(success),
            () => this.onLoginError()
          );
      }
      else {
        this.validateForm();
      }
    }
  }

  protected createForm(): void {
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      username: ['', Validators.required]
    });
    this.changeDetectorRef.detectChanges();
  }

  private onLoginError(): void {
    this.form.setErrors({
      username: 'Wrong Username or password'
    });
    this.loaderService.loader = false;
  }

  private onLoginNext(success: boolean): void {
    if ( success ) {
      this.router.navigate(['/list', this.currentPage], {
        queryParamsHandling: 'preserve'
      });
    }
    else {
      this.form.setErrors({
        username: 'Wrong Username or password'
      });
    }
    this.loaderService.loader = false;
  }
}
