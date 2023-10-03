import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatToolbarModule} from '@angular/material/toolbar';

import {ProjectsPageComponent} from './projects-page.component';
import {ProjectComponent} from './project/project.component';
import {ProjectManageComponent} from './project-manage/project-manage.component';


const routes: Routes = [
  {
    path: '',
    component: ProjectsPageComponent,
  },
  {
    path: 'manage-project',
    component: ProjectManageComponent
  }
];

@NgModule({
  declarations: [
    ProjectsPageComponent,
    ProjectComponent,
    ProjectManageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class ProjectsPageModule {
}
