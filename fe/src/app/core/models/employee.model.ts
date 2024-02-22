export interface EmployeeModel {
  id?: string;
  name: string;
  lastName: string;
  patronymic: string;
  title: string;
}

export interface EmployeePageModel {
  employees: EmployeeModel[];
  total: number;
}
