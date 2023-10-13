import {AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {of, switchMap} from 'rxjs';

import {EMPLOYEE_SERVICE, NotificationService, } from '@core/services';
import {ConfirmWindowDataModel, EmployeeModel} from '@core/models';
import {ConfirmWindowComponent} from '@shared/modules/confirm-window/confirm-window.component';

@Component({
  selector: 'app-employees-page',
  templateUrl: './employees-page.component.html',
  styleUrls: ['./employees-page.component.scss']
})
export class EmployeesPageComponent implements OnInit, AfterViewInit {

  destroyRef = inject(DestroyRef);
  employeeService = inject(EMPLOYEE_SERVICE);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<EmployeeModel>;

  employees!: EmployeeModel[];
  dataSource: MatTableDataSource<EmployeeModel> = new MatTableDataSource([] as EmployeeModel[]);

  displayedColumns: string[] = ['id','lastName',  'name', 'patronymic', 'title'];
  extraDisplayedColumns: string[] = [...this.displayedColumns, 'action'];

  constructor(private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.employeeService.getEmployees()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        {
          next: (data) => {
            this.employees = data;
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error: () => {
            this.notificationService.showErrorNotification('Error: load employee list is failed!');
          },
        });
  }

  onEditEmployee(employee: EmployeeModel) {
    this.router
      .navigate(['manage-employee'], {
        relativeTo: this.route,
        state: {isNewEmployee: false, employee}
      })
      .then(r => console.warn('redirect', r));
  }

  onAddEmployee() {
    this.router
      .navigate(['manage-employee'], {
        relativeTo: this.route,
      })

  }

  onDeleteEmployee(employee: EmployeeModel) {
    const dialogRef = this.dialog.open(ConfirmWindowComponent, {
      data: {
        title: 'Confirm',
        text: `Are you really want to delete '${employee.lastName} ${employee.name} ${employee.patronymic}' employee?`,
        acceptBtnLabel: 'Yes',
        declineBtnLabel: 'No'
      } as ConfirmWindowDataModel,
    });

    dialogRef.afterClosed()
      .pipe(
        switchMap(result => (!!result && !!employee.id
            && this.employeeService.deleteEmployee(+employee.id)
            || of(false)
          )
        ),
        takeUntilDestroyed(this.destroyRef),)
      .subscribe({
        next: (res) => {
          if (res === false) {
            return;
          }
          const index = this.employees.indexOf(employee);
          this.employees.splice(index, 1);
          this.dataSource.data = this.employees;
        },
        error: () => {
          this.notificationService.showErrorNotification('Error: delete employee is failed!');
        }
      });
  }

}
