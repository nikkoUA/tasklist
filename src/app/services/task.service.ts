import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
import { Observable } from 'rxjs/Observable';

import { EditResponseInterface, TaskInterface } from '../../types';
import { AbstractService } from '../abstract';

@Injectable()
export class TaskService extends AbstractService {
  private currentTask: TaskInterface = null;
  private token: string = 'beejee';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  get task(): TaskInterface {
    return this.currentTask;
  }

  set task(task: TaskInterface) {
    this.currentTask = task;
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
      });
  }

  editTask(id: number, task: TaskInterface): Observable<EditResponseInterface> {
    const formData: FormData = new FormData();
    const values: string[] = [];
    Object.keys(task).sort()
      .forEach((field: string) => {
        let value: string = task[field].toString();
        if ( field === 'status' ) {
          value = task[field] ? '10' : '0';
        }
        values.push(`${field}=${encodeURI(value)}`);
        formData.append(field, value);
      });
    formData.append('token', this.token);
    values.push(`token=${encodeURI(this.token)}`);
    formData.append('signature', Md5.hashStr(values.join('&')).toString());
    return this.httpClient
      .post<EditResponseInterface>(`${this.baseUrl}/edit/${id}`, formData, {
        params: {developer: this.developer}
      });
  }
}
