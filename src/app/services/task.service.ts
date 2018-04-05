import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { EditResponseInterface, ListRequestParamsInterface, ListResponseInterface, SortDirectionEnum, SortFieldEnum, TaskInterface } from '../../types';

@Injectable()
export class TaskService {
  private baseUrl: string = 'https://uxcandy.com/~shapoval/test-task-backend';
  private currentPageSubject: Subject<string> = new Subject<string>();
  private developer: string = 'Nikolai-Khilkovsky';
  private listErrorSubject: Subject<string> = new Subject<string>();
  private listRequest: Observable<TaskInterface[]> = null;
  private listRequestParams: Params = {};
  private listRequestDefaultsParams: ListRequestParamsInterface = {
    developer: this.developer,
    page: '1',
    sort_direction: SortDirectionEnum.ASC,
    sort_field: SortFieldEnum.USERNAME
  };
  private tasks: TaskInterface[] = [];
  private totalTaskCountValue: number = 0;

  constructor(private httpClient: HttpClient) {
  }

  get currentPage(): string {
    return this.listRequestParams.page;
  }

  get currentPage$(): Observable<string> {
    return this.currentPageSubject.asObservable();
  }

  get listError$(): Observable<string> {
    return this.listErrorSubject.asObservable();
  }

  get totalTaskCount(): number {
    return this.totalTaskCountValue;
  }

  createTask(task: TaskInterface, image: File): Observable<EditResponseInterface> {
    const formData: FormData = new FormData();
    formData.append('image', image, image.name);
    Object.keys(task)
      .forEach((field: string) => {
        formData.append(field, task[field]);
      });
    return this.httpClient
      .post<EditResponseInterface>(`${this.baseUrl}/create`, formData, {
        params: {developer: this.developer}
      })
  }

  getList(params?: Params): Observable<TaskInterface[]> {
    let newRequest: boolean = false;
    Object.keys(this.listRequestDefaultsParams)
      .forEach((param: string) => {
        const value: string = params[param] || this.listRequestDefaultsParams[param].toString();
        if ( this.listRequestParams[param] !== value ) {
          this.listRequestParams[param] = value;
          newRequest = true;
        }
      });
    if ( newRequest ) {
      this.listRequest = this.httpClient
        .get<ListResponseInterface>(`${this.baseUrl}/`, {params: this.listRequestParams})
        .map((listResponse: ListResponseInterface) => {
          this.updateList(listResponse);
          this.currentPageSubject.next(params['page']);
          return this.tasks;
        })
        .catch((error: ListResponseInterface) => {
          this.updateList(error);
          return Observable.of(this.tasks);
        })
        .share();
    }
    return this.listRequest || Observable.of(this.tasks);
  }

  getTask(id: number): TaskInterface {
    return this.tasks.find((task: TaskInterface) => task.id === id);
  }

  private updateList(listResponse: ListResponseInterface) {
    this.tasks = [];
    if ( listResponse.status === 'ok' && typeof listResponse.message !== 'string' ) {
      this.tasks = listResponse.message.tasks;
      this.totalTaskCountValue = +listResponse.message.total_task_count;
      this.listErrorSubject.next(null);
    }
    else if ( typeof listResponse.message === 'string' ) {
      this.listErrorSubject.next(listResponse.message);
    }
    else {
      this.listErrorSubject.next('Unexpected error');
    }
    this.listRequest = null;
  }
}
