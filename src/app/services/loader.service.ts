import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoaderService {
  private loaderSubject: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.loaderSubject.next(true);
  }

  get loader$(): Observable<boolean> {
    return this.loaderSubject.asObservable();
  }

  set loader(value: boolean) {
    this.loaderSubject.next(value);
  }
}
