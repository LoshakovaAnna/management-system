import {Moment} from "moment";

export interface TaskModel {
  id?: string;
  status: TaskStatus;
  title: string;
  description: string;
  startDate: Moment | Date | string | null;
  endDate: Moment | Date | string | null;
  projectId?: string;
  projectName?: string;
  employeeId?: string;
  employeeFullName?: string;
}

export interface TaskPageModel {
  tasks: TaskModel[];
  total: number;
}

export type TaskStatus = TaskStatusEnum.NotStarted
  | TaskStatusEnum.InProgress
  | TaskStatusEnum.Finished
  | TaskStatusEnum.Delay;

export const enum TaskStatusEnum {
  'NotStarted' = 'Not Started',
  'InProgress' = 'In progress',
  'Finished' = 'Finished',
  'Delay' = 'Delay'
}
