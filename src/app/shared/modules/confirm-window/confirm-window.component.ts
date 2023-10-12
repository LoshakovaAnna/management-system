import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

import {ConfirmWindowDataModel} from '@core/models';


@Component({
  selector: 'app-confirm-window',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirm-window.component.html',
  styleUrls: ['./confirm-window.component.scss']
})
export class ConfirmWindowComponent {

  title: string = '';
  text: string = '';
  acceptBtnLabel: string = 'Ok';
  declineBtnLabel: string = 'Cancel';

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmWindowDataModel) {
    if (!!data) {
      this.title = this.data.title || this.title;
      this.text = this.data.text || this.text;
      this.acceptBtnLabel = this.data.acceptBtnLabel || this.acceptBtnLabel;
      this.declineBtnLabel = this.data.declineBtnLabel || this.declineBtnLabel;
    }
  }

}
