import { Component, OnInit } from '@angular/core';
import {TableMenuService} from '../table-menu.service';
import {ProspectService} from '../../prospect.service';
import {CommonFilterRequest, Filter, GroupByReq, GroupByRequest, SortByReq} from "../../models/requests";
import {GroupedByData} from "../../models/prospect-model";

@Component({
  selector: 'app-group-by-menu',
  templateUrl: './group-by-menu.component.html',
  styleUrls: ['./group-by-menu.component.css']
})
export class GroupByMenuComponent implements OnInit {

  // Group By Function Variables
  isGroupByDDMVisible = false;
  showGroupBYColumnListDDM = false;
  groupByHideOnFocus = false;
  collapseAll = false;
  expandAll = true;
  selectedColumnNameGroupBy: any;
  selectedColumnIconGroupBy: any;
  selectedGroupBYColumn: any;
  defaultGroupBYColumn: any;
  sortAscActive = true;
  sortActive = false;
  sortDscActive = false;
  groupByRequest: GroupByRequest = new GroupByRequest();
  groupedBYData: GroupedByData[];
  colsIndexArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  constructor(public tableMenuService: TableMenuService, public prospectService: ProspectService) { }

  ngOnInit(): void {
    this.tableMenuService.columnNameGroupBy = this.tableMenuService.columnNameGroupBy === '' ?
      this.tableMenuService.prospectColumn[1].title : this.tableMenuService.columnNameGroupBy;
    this.tableMenuService.columnIconGroupBy = this.tableMenuService.columnIconGroupBy === '' ?
      this.tableMenuService.prospectColumn[1].icon : this.tableMenuService.columnIconGroupBy;
    this.tableMenuService.groupByField = this.tableMenuService.groupByField === '' ?
      this.tableMenuService.prospectColumn[1].field : this.tableMenuService.groupByField;
    this.groupByHideOnFocus = true;
    // this.initialiseGroupByReq();
  }

  displayGroupByColumnListDDM(): void {
    this.groupByHideOnFocus = false;
    this.showGroupBYColumnListDDM = true;
    this.tableMenuService.columnNameGroupBy = '';
    this.tableMenuService.columnIconGroupBy = '';
  }

  setGroupByColumnName(value): void {
    /*const index = this.tableMenuService.prospectColumn.findIndex(a => a.title.toLowerCase() === value.toLowerCase());
    if (this.tableMenuService.columnNameGroupBy == '' || index < 0) {
      this.tableMenuService.columnNameGroupBy = this.selectedColumnNameGroupBy;
      this.tableMenuService.columnIconGroupBy = this.selectedColumnIconGroupBy;
    }*/
    if (this.tableMenuService.columnNameGroupBy == '') {
      this.tableMenuService.columnNameGroupBy = this.tableMenuService.prospectColumn[1].title;
      this.tableMenuService.columnIconGroupBy = this.tableMenuService.prospectColumn[1].icon;
    }

  }

  updateColumnNameGroupBy(col: any): void {
    this.tableMenuService.groupByColumnNameSelected = false;
    this.selectedColumnIconGroupBy = col.icon;
    this.selectedColumnNameGroupBy = col.title;
    this.tableMenuService.columnIconGroupBy = col.icon;
    this.tableMenuService.columnNameGroupBy = col.title;
    this.tableMenuService.activeGroupByCol = col;
    // console.log(this.tableMenuService.columnNameGroupBy);
    if (col.type === 'custom') {
      this.tableMenuService.groupByColType = 'custom';
      this.tableMenuService.groupByColId = col.fieldId;
      // this.groupByReq.colId = col.fieldId;
      // this.groupByReq.colType = 'custom';
    } else {
      this.tableMenuService.groupByColType = 'inbuilt';
      this.tableMenuService.groupByColId = col.colId;
      // this.groupByReq.colId = col.colId;
      // this.groupByReq.colType = 'inbuilt';
    }
    this.prepareGroupBy();
    // this.tableMenuService.requestObjForKanbanOrGroupBy = this.groupByFilter;
  }

  prepareGroupBy(): void {
    const filter = new Filter();
    filter.clauseType = 'is';
    filter.columnName = 'firstName';
    filter.columnValue = 'Kamlesh';
    const a = [];
    a.push(filter);
    const commonFilterRequest = new CommonFilterRequest();
    commonFilterRequest.filterClass = 'ProspectorModel';
    commonFilterRequest.filterRequstList = a;
    commonFilterRequest.type = 'and';
    const sortByReq = new SortByReq();
    sortByReq.ascOrDesc = 'asc';
    sortByReq.colId = 1;
    sortByReq.colType = 'inbuilt';
    sortByReq.companyId = 45678;
    sortByReq.userId = 12345;
    const groupByReq = new GroupByReq();
    groupByReq.className = 'ProspectorModel';
    groupByReq.colId = 1;
    groupByReq.colType = 'inbuilt';
    groupByReq.columnName = 'firstName';
    groupByReq.colValue = '';
    this.groupByRequest.commonFilterRequest = commonFilterRequest;
    this.groupByRequest.groupByReq = groupByReq;
    this.groupByRequest.sortByReq = sortByReq;
  }

  collapseAllPanel(): void {
    this.expandAll = false;
    this.collapseAll = true;
    // this.tableMenuService.collapseAllPanel();
  }

  expandAllPanel(): void {
    this.expandAll = true;
    this.collapseAll = false;
    // this.tableMenuService.expandAllPanel();
  }

  groupBySortAscending(): void {
    if (this.tableMenuService.showGroupByComponent) {
      // this.sortByReq.ascOrDesc = 'asc';
      this.tableMenuService.addSortReqOrNot = true;
      this.tableMenuService.columnNameSortBy = this.tableMenuService.columnNameGroupBy;
      // this.tableMenuService.requestObjForKanbanOrGroupBy = this.groupByFilter;
      // this.tableMenuService.applyGroupBy();
    }
  }

  groupByDescending(): void {
    if (this.tableMenuService.showGroupByComponent) {
      // this.sortByReq.ascOrDesc = 'desc';
      this.tableMenuService.addSortReqOrNot = true;
      this.tableMenuService.columnNameSortBy = this.tableMenuService.columnNameGroupBy;
      // this.tableMenuService.requestObjForKanbanOrGroupBy = this.groupByFilter;
      // this.tableMenuService.applyGroupBy();
    }
  }

  showGroupByComponentView(): void {
   /* this.isGroupByDDMVisible = false;
    // console.log(this.tableMenuService.columnNameGroupBy);
    /!*this.tableMenuService.applyGroupBy();
    if (this.tableMenuService.selectedView.viewName !== 'Default Grid View') {
      this.tableMenuService.selectedView.groupByRequest = JSON.stringify(this.tableMenuService.requestObjForKanbanOrGroupBy);
      this.tableMenuService.selectedView.filterRequest = '';
      this.tableMenuService.updateSelectedView();
    }*!/
    this.tableMenuService.sortActive = true;
    this.tableMenuService.resetButtonDisabledGroupBy = false;
    this.tableMenuService.columnNameSortBy = this.tableMenuService.columnNameGroupBy;
    this.tableMenuService.oneGroupByFieldShow = true;
    this.tableMenuService.isGroupByDDMVisible = false;
    // this.tableMenuService.showGridViewComponent = false;
    // this.tableMenuService.showKanbanViewComponent = false;
    // this.tableMenuService.showCardViewComponent = false;
    this.tableMenuService.showGroupByComponent = true;*/
    /*this.prospectService.getGroupedBYData(this.groupByRequest, )*/
    console.log(this.groupByRequest);
    this.prospectService.getGroupedBYData(this.groupByRequest, this.prospectService.selectedTable.tableId, 'linkedIn', 1).subscribe(response => {
      console.log(response);
      this.prospectService.groupedBYData = response.list;
      console.log(this.prospectService.groupedBYData);
    }, error => {
      console.log(error);
    });
    this.tableMenuService.hotInstance.getPlugin('hiddenColumns').hideColumns(this.colsIndexArray);
    this.tableMenuService.showTableView = false;
    this.tableMenuService.isGroupByDDMVisible = false;
    this.tableMenuService.showGroupByComponent = true;
  }

  resetToGridView(): void {
    this.tableMenuService.groupByColumnNameSelected = true;
    this.tableMenuService.resetButtonDisabledGroupBy = true;
    // this.tableMenuService.showGridViewComponent = true;
    this.tableMenuService.showGroupByComponent = false;
    this.tableMenuService.isGroupByDDMVisible = false;
    this.tableMenuService.oneGroupByFieldShow = false;
    this.tableMenuService.columnIconGroupBy = this.tableMenuService.prospectColumn[1].icon;
    this.tableMenuService.columnNameGroupBy = this.tableMenuService.prospectColumn[1].title;
    this.selectedColumnIconGroupBy = this.tableMenuService.prospectColumn[1].icon;
    this.selectedColumnNameGroupBy = this.tableMenuService.prospectColumn[1].title;
    // this.tableMenuService.filteredArray = [];
    this.tableMenuService.columnNameSortBy = '';
    this.tableMenuService.addSortReqOrNot = false;
    this.tableMenuService.sortActive = false;
    // this.tableMenuService.requestObjForKanbanOrGroupBy = new GroupByFilter();
  }

}
