export interface TaskModel {
  id?: number;
  status: TaskStatus;
  title: string;
  description: string;
  startDate: any; // date
  endDate: any; // date
  //projectName
  //fio employee
}
export interface TaskFullModel extends TaskModel {
  projectId?: number;
  projectName?: string;
}

export type TaskStatus = 'Not Started' | 'In progress' | 'Finished' | 'Delay';
