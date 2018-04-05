import { ApiStatusEnum } from './api-status.enum';
import { TaskInterface } from './task.interface'

export interface EditResponseInterface {
  status: ApiStatusEnum,
  message?: TaskInterface | string;
}
