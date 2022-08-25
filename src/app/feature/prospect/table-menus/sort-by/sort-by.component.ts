import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TableMenuService} from '../table-menu.service';
import {ProspectService} from '../../prospect.service';
import {SortByReq, SortByRequest} from '../../models/requests';


@Component({
  selector: 'app-sort-by',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.css']
})
export class SortByComponent implements OnInit {

  // Sort Function Variables
  isSortingLoading = false;
  isSortByDDMVisible = false;
  sortAscActive = true;
  sortActive = false;
  sortDscActive = false;
  columnIconSortBy = 'https://alorecdn.blob.core.windows.net/crmdata/user_icons.svg';
  columnNameSortBy = 'First Name';
  sortByColumnName = 'First Name';
  showSortByColumnListDDM = false;
  sortByHideOnFocus = false;
  showSortByColumnError = false;
  sortByColumnNameSelected = true;

  // sortByObj: SortByFilter = new SortByFilter();
  constructor(public tableMenuService: TableMenuService, public prospectService: ProspectService) {
  }

  ngOnInit(): void {
    // this.tableMenuService.defaultFilterClause.userId = 12345;
    // this.tableMenuService.defaultFilterClause.companyId = 45678;
    this.tableMenuService.columnIconSortBy = this.tableMenuService.columnIconSortBy === '' ?
      this.tableMenuService.prospectColumn[1].icon : this.tableMenuService.columnIconSortBy;
    this.tableMenuService.columnNameSortBy = this.tableMenuService.columnNameSortBy === '' ?
      this.tableMenuService.prospectColumn[1].title : this.tableMenuService.columnNameSortBy;
    this.sortByHideOnFocus = true;
    // this.defaultSortByObj();
  }

  changeToDefault(): void {
    if (this.tableMenuService.sortActive === false) {
      this.sortByColumnNameSelected = true;
      this.tableMenuService.columnIconSortBy = this.tableMenuService.prospectColumn[1].icon;
      this.tableMenuService.columnNameSortBy = this.tableMenuService.prospectColumn[1].title;
      this.sortByColumnName = this.tableMenuService.prospectColumn[1].field;
      this.tableMenuService.prospectDataSet = [];
      this.tableMenuService.prospectDataSet = this.tableMenuService.originalProspectDataSet;
      this.tableMenuService.sortActive = false;
    }
  }

  displaySortByColumnListDDM(): void {
    /*if (this.showSortByColumnListDDM === true) {
      this.sortByHideOnFocus = true;
    } else {
      this.sortByHideOnFocus = false;
    }*/
    this.sortByHideOnFocus = false;
    this.showSortByColumnListDDM = true;
    this.tableMenuService.columnNameSortBy = '';
    this.tableMenuService.columnIconSortBy = '';
  }

  sortByHideFocusInput(): void {
    this.sortByHideOnFocus = true;
    this.tableMenuService.columnNameSortBy = '';
  }

  updateColumnNameSortBy(col: any): void {
    this.sortByColumnNameSelected = false;
    console.log(this.sortByColumnNameSelected);
    console.log(this.prospectService.isSortingLoading);
    this.tableMenuService.columnIconSortBy = col.icon;
    this.tableMenuService.columnNameSortBy = col.title;
    this.tableMenuService.selectedSortByColumn = col;
    if (col.type === 'custom') {
      this.tableMenuService.sortByColId = col.fieldId;
      this.tableMenuService.sortByColType = 'custom';
      // this.sortByObj.colId = col.fieldId;
      // this.sortByObj.colType = 'custom';
    } else {
      this.tableMenuService.sortByColId = col.colId;
      this.tableMenuService.sortByColType = 'inbuilt';
      // this.sortByObj.colId = col.colId;
      // this.sortByObj.colType = 'inbuilt';
    }
  }

  setSortByColumnName(value): void {
    /*const index = this.tableMenuService.prospectColumn.findIndex(a => a.title.toLowerCase() === value.toLowerCase());
    if (this.tableMenuService.columnNameGroupBy == '' || index < 0) {
      this.tableMenuService.columnNameGroupBy = this.selectedColumnNameGroupBy;
      this.tableMenuService.columnIconGroupBy = this.selectedColumnIconGroupBy;
    }*/
    if (this.tableMenuService.columnNameSortBy == '') {
      this.tableMenuService.columnNameSortBy = this.tableMenuService.prospectColumn[1].title;
      this.tableMenuService.columnIconSortBy = this.tableMenuService.prospectColumn[1].icon;
    }

  }

  updateAscOrder(): void {
    this.sortAscActive = true;
    this.sortDscActive = false;
    // this.sortAscending();
  }

  updateDescOrder(): void {
    this.sortAscActive = false;
    this.sortDscActive = true;
    // this.sortDescending();
  }

  applySort(): void {
    this.isSortByDDMVisible = false;
    console.log(this.sortAscActive);
    this.sortAscActive ? this.onSorting('asc') : this.onSorting('desc');
  }

  onSorting(sortByOrder: string) {
    this.tableMenuService.sortActive = true;
    this.prospectService.isSortingLoading = true;
    const sortByRequestBody: SortByReq = new SortByReq();
    sortByRequestBody.ascOrDesc = sortByOrder;
    sortByRequestBody.userId = 12345;
    sortByRequestBody.companyId = 45678;
    sortByRequestBody.colType = 'inbuilt';
    sortByRequestBody.colId = this.tableMenuService.selectedSortByColumn.colId;
    this.prospectService.sortByRequest = sortByRequestBody;
    this.prospectService.applyFilterAndSortOnProspects();
 /*   const sortByRequest: SortByRequest = new SortByRequest();
    sortByRequest.sortByReq = sortByRequestBody;
    this.prospectService.getAllProspectData(this.prospectService.selectedTable.tableId, 1, sortByRequest).subscribe(response => {
      console.log(response);
      this.prospectService.prospectDataSet = response.list;
      this.isSortingLoading = false;

    }, error => {
      console.log(error);
    });*/
  }

  sortDescending(): void {
    this.tableMenuService.addSortReqOrNot = true;
    this.tableMenuService.sortActive = true;
    // this.sortByObj.ascOrDesc = 'desc';
    // this.tableMenuService.sortByObj = this.sortByObj;
    // this.tableMenuService.applyFilter();
  }

  sortAscending(): void {
    this.tableMenuService.addSortReqOrNot = true;
    this.tableMenuService.sortActive = true;
    // this.sortByObj.ascOrDesc = 'asc';
    // this.tableMenuService.sortByObj = this.sortByObj;
    // this.tableMenuService.applyFilter();
  }

  resetToDefaultSort(): void {
    if (this.tableMenuService.sortActive === true) {
      this.sortByColumnNameSelected = true;
      this.tableMenuService.addSortReqOrNot = false;
      this.tableMenuService.columnIconSortBy = this.tableMenuService.prospectColumn[1].icon;
      this.tableMenuService.columnNameSortBy = this.tableMenuService.prospectColumn[1].title;
      this.tableMenuService.prospectDataSet = this.tableMenuService.originalProspectDataSet;
      // this.tableMenuService.filteredArray = this.tableMenuService.defaultFilteredArray;
      this.tableMenuService.sortActive = false;
      // this.tableMenuService.sortByObj = new SortByFilter();
      // this.tableMenuService.applyFilter();
    }
    this.isSortByDDMVisible = false;
    console.log(this.isSortByDDMVisible);
  }

}
