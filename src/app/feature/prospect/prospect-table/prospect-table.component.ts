import {Component, OnInit, ViewChild} from '@angular/core';
import {ProspectService} from '../prospect.service';
import {ActivatedRoute} from '@angular/router';
import {AllTagsOptions, ProspectColumn, ResponseList, TableModel, TagOptions} from '../models/prospect-model';
import {TableMenuService} from '../table-menus/table-menu.service';
import {TableMenusComponent} from '../table-menus/table-menus.component';


@Component({
  selector: 'app-prospect-table',
  templateUrl: './prospect-table.component.html',
  styleUrls: ['./prospect-table.component.css'],
})

export class ProspectTableComponent implements OnInit {

  prospectColumn: ProspectColumn[] = [];
  prospectDataSet: any[] = [];
  selectedTable: TableModel = new TableModel();
  tableId: number;
  showSkeletonDesign = true;
  showTableDesign = false;
  allTagOptions: AllTagsOptions = new AllTagsOptions();
  tagOptionsList: TagOptions [];

  @ViewChild('tableMenusComponent') tableMenusComponent: TableMenusComponent;

  /*HANDSONTABLE VARIABLES STARTS HERE*/
  hotId = 'hotInstance';

  constructor(public prospectService: ProspectService,
              private route: ActivatedRoute,
              public tableMenuService: TableMenuService) {
    this.tableId = this.route.snapshot.params.tableId;
  }


  ngOnInit(): void {
    this.getAllProspectColumns();
    this.getAllProspectData();
    this.getAllTagsOptions();
  }

  getAllProspectColumns(): void {
    this.prospectService.getAllProspectColumns().subscribe(response => {
      console.log(response);
      this.prospectColumn = response.list;
      this.tableMenuService.prospectColumn = response.list;
      this.prospectService.prospectColumn = response.list;
      this.tableMenuService.prospectColumnWithoutCheckedColumn = response.list.filter(a => a.field !== 'checked');
      this.tableMenuService.columnNameGroupBy = response.list[0].title;
      this.tableMenuService.columnIconGroupBy = response.list[0].icon;
      this.tableMenuService.activeGroupByCol = response.list[0];
    }, error => {
      console.log(error);
    });
  }

  getAllProspectData(): void {
    this.prospectService.getAllProspectData(this.tableId, 1).subscribe(response => {
      console.log(response);
      this.showSkeletonDesign = false;
      this.showTableDesign = true;
      this.prospectService.prospectDataSet = response.list;
      this.prospectService.originalProspectDataset = response.list;
      this.selectedTable = response.object;
      this.prospectService.selectedTable = response.object;
      // this.prospectService.prospectDataSet = [];
      // this.prospectService.originalProspectDataset = [];
    }, error => {
      console.log(error);
    });
  }

  getAllTagsOptions(): void {
    this.prospectService.getAllTagOptions().subscribe((response: ResponseList) => {
      console.log(response.list);
      this.tagOptionsList = response.list;
      this.tagOptionsList.forEach(tag => {
        this.prospectService.allTagOptions[tag.tagName] = tag.tagOptions;
      });
    }, error => {
      console.log(error);
    });
  }

  hideField(data: any): void {
  }

  showFilter(data: any): void {
    this.tableMenusComponent.onClickShowAddFilter();
  }

}
