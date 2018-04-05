import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
  private user: string = null;

  get isLoggedIn(): boolean {
    return Boolean(this.user);
  }

  loginAction(userName: string, password: string): Observable<boolean> {
    this.user = !this.isLoggedIn && (userName === 'admin' && password === '123') ? userName : this.user;
    return Observable.of(this.isLoggedIn);
  }

  logoutAction(): Observable<boolean> {
    this.user = null;
    return Observable.of(this.isLoggedIn);
  }
}
