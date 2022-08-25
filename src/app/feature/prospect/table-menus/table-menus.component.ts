import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ProspectService} from '../prospect.service';
import {TableMenuService} from './table-menu.service';
import {ProspectColumn} from '../models/prospect-model';

@Component({
  selector: 'app-table-menus',
  templateUrl: './table-menus.component.html',
  styleUrls: ['./table-menus.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableMenusComponent implements OnInit {

  @Output('rerenderHotTable') rerenderHotTable = new EventEmitter();

  prospectColumn: ProspectColumn[] = [];
  prospectDataSet: any[] = [];
  isLoading = false;

  isHideDDMVisible = false;
  isRowHeightDDMVisible = false;
  hideRowHeightMenuItem = true;

  // Sort By Function
  isSortByDDMVisible = false;

  // Filter Function Variables
  isFilterDDMVisible = false;
  filterArray: any[] = [];
  totalColumnFilter = 1;
  filterFieldShow = true;
  oneFilterFieldShow = false;
  twoFilterFieldShow = false;
  showFilterInputClearImage = true;

  @ViewChild('addFilterEl') addFilterEl: ElementRef;

  // @Output('rerenderHotTable') rerenderHotTable = new EventEmitter();

  constructor(public prospectService: ProspectService,
              public tableMenuService: TableMenuService,
              private cd: ChangeDetectorRef) {
    this.prospectService.sortByDDMVisibility$.subscribe(value => this.isSortByDDMVisible = value );
    setInterval(() => {
      this.cd.detectChanges();
    }, 1000);
  }

  ngOnInit(): void {
    this.tableMenuService.columnIconGroupBy = this.prospectService.prospectColumn[1].icon;
    this.tableMenuService.columnNameGroupBy = this.prospectService.prospectColumn[1].title;
  }

  rowShort(): void {
    this.tableMenuService.rowHeight.short = true;
    this.tableMenuService.rowHeight.medium = false;
    this.tableMenuService.rowHeight.tall = false;
    this.tableMenuService.rowHeight.extraTall = false;
    this.tableMenuService.rerenderHotTable();
    this.tableMenuService.rerenderHotTable();
    this.tableMenuService.rerenderHotTable();
  }

  rowMedium(): void {
    this.tableMenuService.rowHeight.short = false;
    this.tableMenuService.rowHeight.medium = true;
    this.tableMenuService.rowHeight.tall = false;
    this.tableMenuService.rowHeight.extraTall = false;
    this.tableMenuService.rerenderHotTable();
    this.tableMenuService.rerenderHotTable();
    this.tableMenuService.rerenderHotTable();
  }

  rowTall(): void {
    this.tableMenuService.rowHeight.short = false;
    this.tableMenuService.rowHeight.medium = false;
    this.tableMenuService.rowHeight.tall = true;
    this.tableMenuService.rowHeight.extraTall = false;
    this.tableMenuService.rerenderHotTable();
    this.tableMenuService.rerenderHotTable();
    this.tableMenuService.rerenderHotTable();
  }

  rowExtraTall(): void {
    this.tableMenuService.rowHeight.short = false;
    this.tableMenuService.rowHeight.medium = false;
    this.tableMenuService.rowHeight.tall = false;
    this.tableMenuService.rowHeight.extraTall = true;
    this.tableMenuService.rerenderHotTable();
    this.tableMenuService.rerenderHotTable();
    this.tableMenuService.rerenderHotTable();
  }

  onFullScreenMode(): void {
    this.tableMenuService.isFullScreen = !this.tableMenuService.isFullScreen;
    this.tableMenuService.rerenderHotTable();
  }

  onClickShowAddFilter(): void {
    this.addFilterEl.nativeElement.click();
  }

  onChangeWrapCells(isWrapCellsEnabled: boolean): void {
    this.tableMenuService.rerenderHotTable();
    const wrapCellConfigObject = {
      tableName: 'Leads',
      wrapCells: false
    };
    this.tableMenuService.rerenderHotTable();
    this.prospectService.updateWrapCellsState(wrapCellConfigObject).subscribe();
    this.tableMenuService.rerenderHotTable();
  }

}


