import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {UrlPageEnum} from '@core/enums';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    MatToolbarModule,
    MatListModule,
    RouterLink,
    RouterLinkActive
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  urlMap = UrlPageEnum;

}
