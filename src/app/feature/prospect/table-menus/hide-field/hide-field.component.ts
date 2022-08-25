import { Component, OnInit } from '@angular/core';
import {TableMenuService} from '../table-menu.service';
import {ProspectService} from '../../prospect.service';
import {ColumnFilterPipe} from '../../pipes/column-filter.pipe';

@Component({
  selector: 'app-hide-field',
  templateUrl: './hide-field.component.html',
  styleUrls: ['./hide-field.component.css']
})
export class HideFieldComponent implements OnInit {
  isHideDDMVisible = false;
  searchColumn: string;
  showInvalidSearch = false;
  showColumnsDropDown = true;
  isHideAllLoading = false;
  isShowAllLoading = false;
  isAllHidden = false;
  isAllShown = false;
  constructor(public tableMenuService: TableMenuService, private prospectService: ProspectService, private columnFilterPipe: ColumnFilterPipe) { }

  ngOnInit(): void {
    this.checkIsAllShown();
    this.checkIsAllHidden();
  }

  clearHideColumnField(): void {
    this.searchColumn = '';
    this.showInvalidSearch = false;
    this.showColumnsDropDown = true;
  }

  searchColumnFilter(searchColumn: string): void {
    this.columnFilterPipe.transform(this.tableMenuService.prospectColumnWithoutCheckedColumn, searchColumn).length == 0 ? this.showInvalidSearch = true : this.showInvalidSearch = false;
  }

  checkIsAllHidden(): void {
    const isAllHidden = (col) => (col.hidden) == true;
    const checkAllHide = this.tableMenuService.prospectColumnWithoutCheckedColumn.filter((item, index) => index !== 0);
    this.isAllHidden = checkAllHide.every(isAllHidden);
  }

  checkIsAllShown(): void {
    const isAllShown = (col) => (col.hidden) == false;
    const checkAllHide = this.tableMenuService.prospectColumnWithoutCheckedColumn.filter((item, index) => index !== 0);
    this.isAllShown = checkAllHide.every(isAllShown);
  }

  onSwitch(colId: number, hidden: boolean): void {
    console.log(colId);
    this.prospectService.updateHiddenStatus(colId).subscribe(response => {
      this.tableMenuService.prospectColumnWithoutCheckedColumn.find(column => column.colId === colId).hidden = response.object.hidden;
      this.tableMenuService.onHiddenHotCols();
      this.checkIsAllHidden();
      this.checkIsAllShown();
    }, error => {
      console.log(error);
    });
  }

  onShowHideAll(viewStatus: boolean): void {
    viewStatus ? this.isHideAllLoading = true : this.isShowAllLoading = true;
    this.prospectService.updateAllHiddenStatus(viewStatus).subscribe(response => {
      this.tableMenuService.prospectColumnWithoutCheckedColumn.filter((col, index) => index !==0 ).map(column => column.hidden = viewStatus);
      this.tableMenuService.onHiddenHotCols();
      this.isHideAllLoading = false;
      this.isShowAllLoading = false;
      this.checkIsAllHidden();
      this.checkIsAllShown();
    }, error => {
      console.log(error);
    });
  }

}
