import {Injectable} from '@angular/core';
import {ProspectColumn} from '../models/prospect-model';
import {BehaviorSubject} from 'rxjs';
import Handsontable from 'handsontable';

export class RowHeight {
  short = true;
  medium = false;
  tall = false;
  extraTall = false;
}

@Injectable({
  providedIn: 'root'
})
export class TableMenuService {

  currentTableId: number;
  isLoading = false;
  isWrapCellsEnabled = false;
  isFullScreen = false;
  rowHeight: RowHeight = new RowHeight();
  public hotInstance: Handsontable;
  prospectColumn: ProspectColumn[] = [];
  prospectColumnWithoutCheckedColumn: ProspectColumn[] = [];

  totalColumnHidden: number = 0;
  hiddenColumns = [];
  private hiddenHotCols: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  hiddenHotCols$ = this.hiddenHotCols.asObservable();

  prospectDataSet: any[] = [];
  originalProspectDataSet: any[] = [];

  // sort-by  variables
  columnIconSortBy = '';
  columnNameSortBy = '';
  sortByField = '';
  sortByColId = 1;
  sortByColType = 'inbuilt';
  sortActive = false;
  isSortByDDMVisible = false;
  selectedSortByColumn: ProspectColumn;
  // sortByObj: SortByFilter = new SortByFilter();


  // group-by table menu
  isGroupByDDMVisible = false;
  columnNameGroupBy = '';
  columnIconGroupBy = '';
  groupByField = '';
  oneGroupByFieldShow = false;
  resetButtonDisabledGroupBy = true;
  groupByColumnNameSelected = true;
  activeGroupByCol: any;
  groupByColId = 1;
  groupByColType = 'inbuilt';
  groupByPageIndex = [];
  // isGroupByPageDataFull = [];

  // add-filter-variables
  // defaultFilterClause: SortAndFilterRequest = new SortAndFilterRequest();
  totalColumnFilter = 1;
  filterFieldShow = true;
  oneFilterFieldShow = false;
  twoFilterFieldShow = false;
  addFilterActive = true;
  isDisabled = true;
  // commonFilterRequest: CommonFilterRequest = new CommonFilterRequest();

  // add-view variables
  addSortReqOrNot = false;


  // SelectedView
  showGroupByComponent = false;
  showTableView = true;

  dataLoaded = false;
  homePageLoaded = false;

  onHiddenHotCols(): void {
    // adding index+1 to compensate the checkbox column
    const hiddenHotCols: any[] = this.prospectColumnWithoutCheckedColumn.map((col, index) => col.hidden === true ? index+1 : '').filter(Number);
    this.totalColumnHidden = hiddenHotCols.length;
    this.hiddenColumns = hiddenHotCols;
    if (this.hotInstance != undefined) {
      this.rerenderHotTable();
    }
    // this.hiddenHotCols.next(hiddenHotCols);
  }

  rerenderHotTable(): void {
    setTimeout(() => {
      this.hotInstance.render();
    }, 10);
  }

}
