import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {EMPLOYEE_SERVICE, NotificationService} from '@core/services';
import {EmployeeModel} from '@core/models';
import {UrlPageEnum} from '@core/enums';

@Component({
  selector: 'app-employee-manage',
  templateUrl: './employee-manage.component.html',
  styleUrls: ['./employee-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeManageComponent implements OnInit {

  destroyRef = inject(DestroyRef);
  employeeService = inject(EMPLOYEE_SERVICE);

  title = '';
  isNewEmployee: boolean = true;
  employee!: EmployeeModel;

  employeeForm = new FormGroup({
    id: new FormControl(''),
    lastName: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    patronymic: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
  });
  filedList = ['id', 'lastName', 'name', 'patronymic', 'title', ];

  returnLink = [`/${UrlPageEnum.employees}`];

  constructor(private router: Router,
              private notificationService: NotificationService) {
    this.employee = this.router.getCurrentNavigation()?.extras?.state?.['employee'];
  }

  ngOnInit(): void {
    this.isNewEmployee = !this.employee;
    this.title = this.isNewEmployee ? ' Create Employee' : 'Edit Employee';
    if (this.employee) {
      // @ts-ignore
      this.employeeForm.patchValue(this.employee);
    }
    this.employeeForm.get('id')?.disable();
  }


  onSubmit(): void {
    this.employeeForm.enable();
    const value = this.employeeForm.value;
    if (this.isNewEmployee) {
      delete value.id;
    }

    const req = this.isNewEmployee
      ? this.employeeService.postEmployee(value as EmployeeModel)
      : this.employeeService.putEmployee(value as EmployeeModel);
    req
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
          next: () => {
            this.router.navigateByUrl(`/${UrlPageEnum.employees}`);
          },
          error: (error) => {
            this.notificationService.showErrorNotification('Error: send request is failed!');
          }
        }
      );
  }
}
