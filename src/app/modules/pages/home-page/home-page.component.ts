import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PageTitleComponent} from '@shared/modules';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  standalone: true,
  imports: [CommonModule, PageTitleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {

}
