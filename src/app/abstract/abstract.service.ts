import { HttpClient } from '@angular/common/http';

export abstract class AbstractService {
  protected baseUrl: string = 'https://uxcandy.com/~shapoval/test-task-backend';
  protected developer: string = 'Nikolai-Khilkovsky';

  constructor(protected httpClient: HttpClient) {
  }
}
