import {Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {TaskStatusEnum} from "@core/models";

@Directive({
  selector: '[appStatusColor]',
  standalone: true
})
export class StatusColorDirective implements OnChanges {
  @Input() appStatusColor?: TaskStatusEnum | string;

  constructor(private el: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    const color = changes['appStatusColor']?.currentValue;
    if (!color) {
      return
    }
    switch (color) {
      case (TaskStatusEnum.NotStarted): {
        this.el.nativeElement.classList.add('status-not-started');
        break;
      }
      case (TaskStatusEnum.InProgress): {
        this.el.nativeElement.classList.add('status-in-progress');
        break;
      }
      case (TaskStatusEnum.Finished): {
        this.el.nativeElement.classList.add('status-finished');
        break;
      }
      case (TaskStatusEnum.Delay): {
        this.el.nativeElement.classList.add('status-delay');
        break;
      }
    }
  }

}
