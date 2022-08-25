import {Component, OnInit} from '@angular/core';
import {TableMenuService} from '../table-menu.service';
import {CommonFilterRequest, Filter, FilterProperty} from '../../models/requests';
import {ProspectService} from '../../prospect.service';

@Component({
  selector: 'app-add-filter',
  templateUrl: './add-filter.component.html',
  styleUrls: ['./add-filter.component.css']
})
export class AddFilterComponent implements OnInit {

  // Filter Function Variables
  public isLoading: boolean;
  isFilterDDMVisible = false;
  filterFieldShow = true;
  oneFilterFieldShow = false;
  twoFilterFieldShow = false;
  filterArray: any[] = [];
  timeout: any = null;
  isAndOrVisible = false;
  andOrStatus = 'And';
  openedFilterIndex: number;
  andOr = ['And', 'Or'];
  showContainsError = false;
  dateFormatForFilter = 'dd/MM/yyyy';
  isSaveButtonDisabled = true;
  containsDefault = ['Contains', 'Does Not Contains', 'Is', 'Is Not', 'Is Empty', 'Is Not Empty'];
  filterClause: CommonFilterRequest = new CommonFilterRequest();
  defaultFilterClause: CommonFilterRequest = new CommonFilterRequest();
  dater = [];
  filterDater = [];
  dateFormat = 'dd-MM-yyyy';
  defaultFilter = {
    andOr: 'And',
    selectedCol: {name: 'First Name', icon: 'https://alorecdn.blob.core.windows.net/crmdata/user_icons.svg'},
    contains: 'Contains',
    showContainsDDM: false,
    showColDDM: false,
    showSearchDataDDm: false,
    hideIconOnFocus: true,
    fieldName: 'firstName',
    searchFilter: {searchFilterText: '', searchFilterArray: []},
    dateFilter: [],
    containsArray: ['Contains', 'Does Not Contains', 'Is', 'Is Not', 'Is Empty', 'Is Not Empty']
  };

  constructor(public tableMenuService: TableMenuService,
              public prospectService: ProspectService) {
  }

  ngOnInit(): void {
    if (this.prospectService.commonFilterRequest.filterRequstList.length !== 0 ) {
      this.filterArray = this.prospectService.filterArray;
      this.filterClause = this.prospectService.commonFilterRequest;
      this.tableMenuService.isDisabled = false;
      this.andOrStatus = this.prospectService.andOrStatus;
    } else {
      this.addAndUpdateFilter();
    }
    this.checkIsSaveButton();
  }

  popFilter(index: number): void {
    if (this.filterArray.length > 1 && index !== 0) {
      this.filterArray.pop();
    }
    if ( this.filterClause.filterRequstList.length > 1 && index !== 0) {
      this.filterClause.filterRequstList.pop();
    }
    // this.filterArray.pop();
    // this.filterClause.filterRequstList.pop();
    if (index === 0) {
      this.resetToDefault();
    } else {
      this.additionalFilters();
    }
    // console.log(this.filterArray);
  }

  additionalFilters(): void {
    this.prospectService.isFilterLoading = true;
    console.log(this.prospectService.isFilterLoading);
    this.defaultFilterClause.filterRequstList = [];
    if (this.filterClause.filterRequstList.length !== 0) {
      this.tableMenuService.isDisabled = false;
      for (const filterRequestList of this.filterClause.filterRequstList) {
        // console.log(filterRequestList);
        if (filterRequestList.clauseType === 'dateRanges' && filterRequestList.startDate !== ''
          && filterRequestList.endDate !== '') {
          this.defaultFilterClause.filterRequstList.push(filterRequestList);
          // tslint:disable-next-line:max-line-length
        } else if ((filterRequestList.clauseType === 'is' || filterRequestList.clauseType === 'isNot')
          && filterRequestList.columnValue !== '') {
          this.defaultFilterClause.filterRequstList.push(filterRequestList);
        } else if (filterRequestList.clauseType === 'isNotEmpty' || filterRequestList.clauseType === 'isEmpty') {
          this.defaultFilterClause.filterRequstList.push(filterRequestList);
        } else if ((filterRequestList.clauseType === 'contains' || filterRequestList.clauseType === 'doesNotContains')
          && filterRequestList.columnValue !== '') {
          this.defaultFilterClause.filterRequstList.push(filterRequestList);
        }
      }
    }
    this.tableMenuService.addFilterActive = true;
    // console.log(this.defaultFilterClause);
    this.defaultFilterClause.type = this.andOrStatus;
    if (this.defaultFilterClause.filterRequstList.length > 0) {
      this.prospectService.filterArray = this.filterArray;
      this.prospectService.commonFilterRequest = this.defaultFilterClause;
      this.prospectService.applyFilterAndSortOnProspects();
      /*this.tableMenuService.applyFilter();*/
    } else {
      this.prospectService.isFilterLoading = false;
    }
    console.log(this.defaultFilterClause);
    this.checkAddedFilterCount();
    this.checkIsSaveButton();
  }

  checkAddedFilterCount(): void {
    this.tableMenuService.totalColumnFilter = this.defaultFilterClause.filterRequstList.length;
    if (this.tableMenuService.totalColumnFilter > 1) {
      this.tableMenuService.oneFilterFieldShow = false;
      this.tableMenuService.filterFieldShow = false;
      this.tableMenuService.twoFilterFieldShow = true;
    } else if (this.tableMenuService.totalColumnFilter === 1) {
      this.tableMenuService.oneFilterFieldShow = true;
      this.tableMenuService.filterFieldShow = false;
      this.tableMenuService.twoFilterFieldShow = false;
    } else if (this.tableMenuService.totalColumnFilter === 0) {
      this.tableMenuService.oneFilterFieldShow = false;
      this.tableMenuService.filterFieldShow = true;
      this.tableMenuService.twoFilterFieldShow = false;
    }
  }

  toggleAndOr(filterIndex: number): void {
    this.isAndOrVisible = !this.isAndOrVisible;
    this.openedFilterIndex = filterIndex;
  }

  onFilterAndOr(value: string, filterIndex: number): void {
    this.andOrStatus = value;
    this.prospectService.andOrStatus = value;
    this.filterArray[filterIndex].andOr = value;
    this.defaultFilter.andOr = value;
    /*this.filterClause.type = value;
    this.gridOperationType = value === 'and' ? 'conjunction' : 'disjunction';
    for (const item of this.filterRequestForGridView) {
      item.operationId = this.gridOperationType;
    }*/
  }

  displayColumnListDDM(index: number): void {
    this.filterArray[index].showColDDM = !this.filterArray[index].showColDDM;
    this.filterArray[index].selectedCol.name = '';
    if (this.filterArray[index].showColDDM === true) {
      this.filterArray[index].hideIconOnFocus = true;
    } else {
      this.filterArray[index].selectedCol.name = 'First Name';
      this.filterArray[index].hideIconOnFocus = false;
    }
    this.filterArray[index].hideIconOnFocus = true;
  }

  setDefaultFilter(index: number): void {
    if (this.filterArray[index].selectedCol.name === '') {
      this.filterArray[index].selectedCol.name = 'First Name';
      this.filterArray[index].selectedCol.icon = 'https://alorecdn.blob.core.windows.net/crmdata/user_icons.svg';
      this.filterArray[index].selectedCol.fieldName = 'firstName';
      this.getSearchedRowData('firstName', index);
    }
  }

  hideFocus(index: number): void {
    this.filterArray[index].hideIconOnFocus = true;
    // this.hideOnFocus = true;
    // this.columnName = '';
    this.filterArray[index].selectedCol.name = '';
  }

  updateColumnName(col: any, index: number, colIndex: number): void {
    this.filterArray[index].selectedCol.name = col.title;
    this.filterArray[index].selectedCol.icon = col.icon;
    this.filterArray[index].fieldName = col.field;
    this.filterArray[index].selectedCol.fieldName = col.field;
    this.filterClause.filterRequstList[index].columnName = col.field;
    if (col.type === 'date') {
      this.filterArray[index].containsArray = [];
      this.filterArray[index].containsArray.push('Date ranges');
      this.filterArray[index].contains = 'Date ranges';
      this.filterClause.filterRequstList[index].clauseType = this.getConditionToFilter('Date ranges');
      /*this.filterClause.filterRequstList[index].columnValue =
        this.filterClause.filterRequstList[index].columnValue !== '' ?
          this.filterClause.filterRequstList[index].columnValue : '';*/
      this.filterClause.filterRequstList[index].columnValue = '';
      this.filterClause.filterRequstList[index].startDate = '';
      this.filterClause.filterRequstList[index].endDate = '';
    } else {
      this.filterArray[index].containsArray = this.containsDefault.filter(item => item !== 'Date ranges');
      // this.filterArray[index].contains = 'Contains';
      this.dater = [];
      // this.filterClause.filterRequstList[index].clauseType = this.getConditionToFilter('Contains');
      this.filterClause.filterRequstList[index].columnValue = '';
      /*this.filterClause.filterRequstList[index].columnValue =
        this.filterClause.filterRequstList[index].columnValue !== '' ?
          this.filterClause.filterRequstList[index].columnValue : '';*/
    }
    this.filterArray[index].searchFilter.searchFilterText = '';
   // console.log(this.filterArray[index].searchFilter.searchFilterArray);
    this.getSearchedRowData(col.field, index);
    this.checkIsSaveButton();
  }

  getSearchedRowData(fieldName: any, index: number): void {
    let tempArray = [];
    if (Array.isArray(this.prospectService.originalProspectDataset[0][fieldName])) {
      tempArray = this.prospectService.allTagOptions[fieldName];
    } else {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.prospectService.originalProspectDataset.length; i++) {
        if (tempArray.indexOf(this.prospectService.originalProspectDataset[i][fieldName]) === -1) {
          tempArray.push(this.prospectService.originalProspectDataset[i][fieldName]);
        }
      }
    }
    // console.log(tempArray);
    // console.log(this.filterArray[index]);
    this.filterArray[index].searchFilter.searchFilterArray = tempArray;
  }

  displayContainsListDDM(index: number): void {
    this.filterArray[index].showContainsDDM = !this.filterArray[index].showContainsDDM;
  }

  updateCondition(value: any, index): void {
    // this.filterRequestForGridView[index].name = this.getConditionToFilterForGridView(value);
    this.filterArray[index].contains = value;
    this.filterClause.filterRequstList[index].clauseType = this.getConditionToFilter(value);
    this.filterArray[index].searchFilter.searchFilterText = '';
    this.filterClause.filterRequstList[index].columnValue = '';
  }

  displayFilterSearchResult(index: number): void {
    this.filterArray[index].showSearchDataDDm = !this.filterArray[index].showSearchDataDDm;
  }

  displayAddContainsListDDM(i: any): void {
    this.filterArray[i].showContainsDDM = !this.filterArray[i].showContainsDDM;
  }

  private onKeySearch(event: any, value: any, index: number): void {
    clearTimeout(this.timeout);
    if (event.target.value === '') {
      this.prospectService.isFilterLoading = true;
      setTimeout(() => {
        this.prospectService.prospectDataSet = this.prospectService.originalProspectDataset;
        this.prospectService.isFilterLoading = false;
      }, 1000);
    }
    this.timeout = setTimeout(() => {
      if (event.keyCode !== 13 &&  event.target.value !== '') {
        this.prospectService.isFilterLoading = true;
        this.updateSearchData(value, index);
        this.additionalFilters();
      }
    }, 1000);
  }

  updateSearchData(value: any, index: number): void {
    this.filterArray[index].searchFilter.searchFilterText = value;
    this.filterClause.filterRequstList[index].columnValue = value;
    // console.log(this.filterClause);
    console.log(this.filterArray);
    this.checkIsSaveButton();
  }

  updateDateForFilter(index: number): void {
    if (this.filterArray[index].dater.length === 2 && this.filterArray[index].dater[0].toISOString().slice(0, 10) !== ''
      && this.filterArray[index].dater[1].toISOString().slice(0, 10) !== '') {
      this.filterClause.filterRequstList[index].startDate = this.filterArray[index].dater[0].toISOString().slice(0, 10);
      this.filterClause.filterRequstList[index].endDate = this.filterArray[index].dater[1].toISOString().slice(0, 10);
    }
  }

  addAndUpdateFilter(): void {
    const addFilter = this.defaultFilter;
    addFilter.andOr = this.andOrStatus;
    const tempArr = [];
    // console.log(this.tableMenuService.listOfData);
    for (const listOfData of this.prospectService.originalProspectDataset) {
      if (tempArr.indexOf(listOfData[this.prospectService.prospectColumn[1].field]) === -1) {
        tempArr.push(listOfData[this.prospectService.prospectColumn[1].field]);
      }
    }
    addFilter.searchFilter.searchFilterArray = tempArr;
    const filterRequestList = new Filter();
    filterRequestList.columnValue = '';
    filterRequestList.clauseType = 'contains';
    filterRequestList.columnName = 'firstName';
    this.filterClause.type = this.andOrStatus;
    this.filterClause.filterClass = 'ProspectorModel';
    this.filterClause.filterRequstList.push(filterRequestList);
    this.filterArray.push(JSON.parse(JSON.stringify(addFilter)));
  }

  resetToDefault(): void {
    this.filterArray.length = 0;
    this.prospectService.filterArray.length = 0;
    this.tableMenuService.isDisabled = true;
    this.filterClause.type = 'and';
    this.filterClause.filterRequstList.length = 0;
    this.addAndUpdateFilter();
    this.isSaveButtonDisabled = true;
    this.tableMenuService.oneFilterFieldShow = false;
    this.tableMenuService.totalColumnFilter = 0;
    this.tableMenuService.filterFieldShow = true;
    this.tableMenuService.twoFilterFieldShow = false;
    this.tableMenuService.addFilterActive = false;
    this.prospectService.commonFilterRequest = new CommonFilterRequest();
    this.prospectService.prospectDataSet = this.prospectService.originalProspectDataset;
    this.isFilterDDMVisible = false;
  }

  getConditionToFilter(condition: any): string {
    let str = '';
    switch (condition) {
      case 'Contains':
        str = 'contains';
        break;
      case 'Does Not Contains':
        str = 'doesNotContains';
        break;
      case 'Is':
        str = 'is';
        break;
      case 'Is Not':
        str = 'isNot';
        break;
      case 'Is Empty':
        str = 'isEmpty';
        break;
      case 'Is Not Empty':
        str = 'isNotEmpty';
        break;
      case 'Date ranges':
        str = 'dateRanges';
        break;
    }
    return str;
  }

  get(condition: any): string {
    let str = '';
    switch (condition) {
      case 'contains':
        str = 'Contains';
        break;
      case 'doesNotContains':
        str = 'Does Not Contains';
        break;
      case 'is':
        str = 'Is';
        break;
      case 'isNot':
        str = 'Is Not';
        break;
      case 'isEmpty':
        str = 'Is Empty';
        break;
      case 'isNotEmpty':
        str = 'Is Not Empty';
        break;
      case 'dateRanges':
        str = 'Date ranges';
        break;
    }
    return str;
  }

  checkIsSaveButton(): void {
    if ((this.filterArray[0].contains !== '' && this.filterArray[0].fieldName !== '' &&
      this.filterArray[0].searchFilter.searchFilterText !== '')
      || (this.filterArray[0].contains === 'Date ranges' && this.filterArray[0].length !== 0)) {
      this.isSaveButtonDisabled = false;
    } else {
      this.isSaveButtonDisabled = true;
    }
  }

}
