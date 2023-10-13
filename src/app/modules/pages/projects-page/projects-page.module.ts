import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';

import {ProjectsPageComponent} from './projects-page.component';
import {ProjectManageComponent} from './project-manage/project-manage.component';
import {EntriesTableComponent, TasksTableComponent} from '@shared/modules';


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
    ProjectManageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatToolbarModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    EntriesTableComponent,
    TasksTableComponent,
  ]
})
export class ProjectsPageModule {
}
