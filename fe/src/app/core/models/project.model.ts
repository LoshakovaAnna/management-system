export interface  ProjectModel {
  id?: string;
  name: string;
  description: string;
}

export interface ProjectPageModel {
  projects: ProjectModel[];
  total: number;
}
