import { ApiStatusEnum } from './api-status.enum';
import { SortDirectionEnum, SortFieldEnum } from './list.enum';
import { TaskInterface } from './task.interface';

export interface ListRequestParamsInterface {
  developer?: string;
  page?: string;
  sort_direction?: SortDirectionEnum;
  sort_field?: SortFieldEnum;
}

export interface ListResponseInterface {
  status: ApiStatusEnum;
  message?: string | TasksInterface;
}

export interface TasksInterface {
  tasks: TaskInterface[];
  total_task_count: string;
}
