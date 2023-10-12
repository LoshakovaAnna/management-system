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
    path: UrlPageEnum.projects,
    loadChildren: () => import('./modules/pages/projects-page/projects-page.module')
      .then(mod => mod.ProjectsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
