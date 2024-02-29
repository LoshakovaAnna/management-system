import {Moment} from "moment";

export interface TaskModel {
  id?: number;
  status: TaskStatus;
  title: string;
  description: string;
  startDate: Moment | Date | string | null;
  endDate: Moment | Date | string | null;
  projectId?: number;
  projectName?: string;
  employeeId?: number;
  employeeFullName?: string;
}

export type TaskStatus = 'Not Started' | 'In progress' | 'Finished' | 'Delay';
