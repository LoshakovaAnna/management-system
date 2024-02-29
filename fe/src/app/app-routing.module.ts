import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UrlPageEnum} from '@core/enums';

const routes: Routes = [
  {
    path: '',
    redirectTo: UrlPageEnum.home,
    pathMatch: 'full',
  },
  {
    path: UrlPageEnum.home,
    loadComponent: () => import('./modules/pages/home-page/home-page.component')
      .then(mod => mod.HomePageComponent),
  },
  {
    path: UrlPageEnum.login,
    loadComponent: () => import('./modules/pages/login-page/login-page.component')
      .then(mod => mod.LoginPageComponent),
  },
  {
    path: UrlPageEnum.projects,
    loadChildren: () => import('./modules/pages/projects-page/projects-page.module')
      .then(mod => mod.ProjectsPageModule),
  },
  {
    path: UrlPageEnum.tasks,
    loadChildren: () => import('./modules/pages/tasks-page/tasks-page.module')
      .then(mod => mod.TasksPageModule),
  },
  {
    path: UrlPageEnum.employees,
    loadChildren: () => import('./modules/pages/employees-page/employees-page.module')
      .then(mod => mod.EmployeesPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
