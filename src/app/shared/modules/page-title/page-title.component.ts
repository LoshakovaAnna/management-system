import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-page-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageTitleComponent {
  @Input() title: string = '';
}
