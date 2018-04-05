import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
  private user: string;

  constructor() {
    this.user = sessionStorage.getItem('user') || null;
  }

  get isLoggedIn(): boolean {
    return Boolean(this.user);
  }

  loginAction(userName: string, password: string): Observable<boolean> {
    this.user = !this.isLoggedIn && (userName === 'admin' && password === '123') ? userName : this.user;
    sessionStorage.setItem('user', this.user);
    return Observable.of(this.isLoggedIn);
  }

  logoutAction(): Observable<boolean> {
    this.user = null;
    sessionStorage.removeItem('user');
    return Observable.of(this.isLoggedIn);
  }
}
