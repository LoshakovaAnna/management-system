import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatSortModule, Sort} from '@angular/material/sort';
import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';

import {DEFAULT_TABLE_CONFIG, SortDirectionEnum, TableConfigModel} from '@models/table-config.model';
import {TaskModel} from '@core/models';
import {StatusColorDirective} from '@shared/directives/status-color.directive';

@Component({
  selector: 'app-entries-table',
  standalone: true,
  templateUrl: './entries-table.component.html',
  styleUrls: ['./entries-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    StatusColorDirective
  ],
})
export class EntriesTableComponent implements OnChanges {
  @ViewChild(MatTable) table!: MatTable<TaskModel>;

  @Input() displayedColumns: string[] = [];
  @Input() columnLabels: { [key: string]: string } = {};
  @Input() entries: any[] = [];
  @Input() entryName: string = 'Entry';
  @Input() totalEntries: number = 0;

  @Output() addEntry = new EventEmitter();
  @Output() deleteEntry = new EventEmitter();
  @Output() editEntry = new EventEmitter();
  @Output() changePageConfig = new EventEmitter();

  tableConfig: TableConfigModel = {...DEFAULT_TABLE_CONFIG};


  extraDisplayedColumns: string[] = [];
  dataSource: MatTableDataSource<TaskModel> = new MatTableDataSource([] as TaskModel[]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['entries'] && !!changes['entries'].currentValue) {
      this.dataSource = new MatTableDataSource(changes['entries'].currentValue);
    }
    if (changes && changes['displayedColumns'] && !!changes['displayedColumns'].currentValue) {
      this.extraDisplayedColumns = [...changes['displayedColumns'].currentValue, 'action'];
    }
  }

  constructor() {
  }

  onAddTask() {
    this.addEntry.emit();
  }

  onDeleteEntry(row: any) {
    this.deleteEntry.emit(row);
  }

  onEditEntry(row: any) {
    this.editEntry.emit(row);
  }

  onChangePage(event: PageEvent) {
    this.tableConfig.pageIndex = event.pageIndex;
    this.tableConfig.pageSize = event.pageSize;
    this.changePageConfig.emit(this.tableConfig);
  }

  onChangeSort(event: Sort) {
    this.tableConfig.sortDirection = !!event.direction ? SortDirectionEnum[event.direction] : 0;
    this.tableConfig.sortField = !!event.direction ? event.active : '';
    this.changePageConfig.emit(this.tableConfig);
  }
}
