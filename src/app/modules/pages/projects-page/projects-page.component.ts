import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTable, MatTableDataSource} from '@angular/material/table';

import {PROJECT_SERVICE} from '@core/services';
import {ProjectModel} from '@core/models';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectsPageComponent implements OnInit, AfterViewInit {

  projectService = inject(PROJECT_SERVICE);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProjectModel>;

  projects!: ProjectModel[];
  dataSource: MatTableDataSource<ProjectModel> = new MatTableDataSource([] as ProjectModel[]);

  displayedColumns: string[] = ['id', 'name', 'description'];
  extraDisplayedColumns: string[] = [...this.displayedColumns, 'action'];

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.projectService.getProjects()
      .pipe()
      .subscribe(
        {
          next: (data) => {
            this.projects = data;
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error: (e) => console.error(e),
        });
  }

  onEditProject(project: ProjectModel) {
    this.router
      .navigate(['manage-project'], {
        relativeTo: this.route,
        state: {isNewProject: false, project}
      })
      .then(r => console.warn('redirect', r));
  }
  onAddProject(){
    this.router
      .navigate(['manage-project'], {
        relativeTo: this.route,
      })

  }

  onDeleteProject(project: ProjectModel) {
    if (!window.confirm(`Are you really want to delete ${project.name} project?`)) {
      return;
    }
    if (!project.id) {
      return;
    }
    this.projectService.deleteProject(+project.id)
      .subscribe(
        () => {
          const index = this.projects.indexOf(project);
          this.projects.splice(index, 1);
          this.dataSource.data = this.projects;
        }
      );
  }

}
