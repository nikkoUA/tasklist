import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ListRequestParamsInterface, ListResponseInterface, SortDirectionEnum, SortFieldEnum, TaskInterface } from '../../types';
import { AbstractService } from '../abstract';

@Injectable()
export class ListService extends AbstractService {
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

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  get currentPage(): string {
    return this.listRequestParams.page;
  }

  get listError$(): Observable<string> {
    return this.listErrorSubject.asObservable();
  }

  get totalTaskCount(): number {
    return this.totalTaskCountValue;
  }

  set reload(reload: boolean) {
    if ( reload ) {
      this.listRequestParams = {};
    }
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
