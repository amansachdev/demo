import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import Handsontable from 'handsontable';
import CellValue = Handsontable.plugins.CellValue;
import ChangeSource = Handsontable.ChangeSource;
import CellChange = Handsontable.CellChange;
import {HotTableRegisterer} from '@handsontable/angular';
import {ProspectService} from '../prospect.service';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ProspectColumn, TagOptions} from '../models/prospect-model';
import {ArrayFilterPipe} from '../pipes/array-filter.pipe';
import {DomPortal} from '@angular/cdk/portal';
import {FroalaEditorComponent} from '../froala-editor/froala-editor.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {TableMenuService} from '../table-menus/table-menu.service';
import {Subscription} from 'rxjs';
import {Filter, SortByReq, SortByRequest} from "../models/requests";

const colorCode = ['#0054D1', '#0B76B7', '#06A09B', '#DA0240', '#E89500', '#D600B8', '#C53700', '#0013FF', '#338A17', '#444444'];
const backGround = ['rgba(0, 84, 209, 0.2)', 'rgba(11, 118, 183, 0.2)', 'rgba(6, 160, 155, 0.2)', 'rgba(218, 2, 64, 0.2)', 'rgba(232, 149, 0, 0.2)', 'rgba(214, 0, 184, 0.2)', 'rgba(197, 55, 0, 0.2)', 'rgba(0, 19, 255, 0.2)', 'rgba(51, 138, 23, 0.2)', 'rgba(68, 68, 68, 0.2)'];
const cellErrorIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.0002 3.11523C6.19096 3.11523 3.11523 6.21144 3.11523 10.0002C3.11523 13.8095 6.21144 16.8852 10.0002 16.8852C13.8095 16.8852 16.8852 13.789 16.8852 10.0002C16.8852 6.1912 13.8093 3.11523 10.0002 3.11523ZM10.0002 15.6752C6.86927 15.6752 4.32523 13.1312 4.32523 10.0002C4.32523 6.86927 6.86927 4.32523 10.0002 4.32523C13.1312 4.32523 15.6752 6.86927 15.6752 10.0002C15.6752 13.1312 13.1312 15.6752 10.0002 15.6752Z" fill="#FF0101" stroke="#FF0101" stroke-width="0.25"/>
<path d="M10.2921 12.8118L10.2917 12.8115L10.2844 12.8202C10.2159 12.9025 10.1174 12.9352 10.0004 12.9352C9.87522 12.9352 9.76918 12.8896 9.69363 12.8166C9.62876 12.7339 9.58545 12.6419 9.58545 12.5202C9.58545 12.4147 9.63131 12.3061 9.70884 12.2286C9.86002 12.0774 10.1409 12.0774 10.2921 12.2286C10.3696 12.3061 10.4154 12.4147 10.4154 12.5202C10.4154 12.6432 10.3715 12.7324 10.2921 12.8118Z" fill="#FF0101" stroke="#FF0101" stroke-width="0.25"/>
<path d="M10.0004 10.7354C9.76948 10.7354 9.58545 10.5514 9.58545 10.3204V7.48043C9.58545 7.24947 9.76948 7.06543 10.0004 7.06543C10.2314 7.06543 10.4154 7.24947 10.4154 7.48043V10.3204C10.4154 10.5514 10.2314 10.7354 10.0004 10.7354Z" fill="#FF0101" stroke="#FF0101" stroke-width="0.25"/>
</svg>`;

@Component({
  selector: 'app-hands-on-table',
  templateUrl: './hands-on-table.component.html',
  styleUrls: ['./hands-on-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandsOnTableComponent implements OnInit {

  constructor(public prospectService: ProspectService,
              private arrayFilterPipe: ArrayFilterPipe,
              private cdkOverlay: Overlay,
              private nzModalService: NzModalService,
              private cd: ChangeDetectorRef,
              public tableMenuService: TableMenuService) {
    setInterval(() => {
      this.cd.detectChanges();
    }, 1000);
  }

  /* VALIDATOR STARTS HERE */
  readonly emailValidatorRegex = new RegExp(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/);
  readonly urlValidatorRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&\/=]*)/);
  readonly textValidatorRegex = new RegExp(/^[a-zA-Z]+$/);
  /* VALIDATION ENDS HERE*/

  /*VALIDATION ERROR MESSAGES STARTS HERE*/
  private readonly errorMessages = {
    textonly: 'This is Text only field. The data should be in text format only.',
    email: 'This is email field. Please provide a valid email id.',
    url: 'This is URL field. The data should begin with https:// or http://',
    number: 'This is number only field. The data should be in number format only.',
    date: 'Invalid date'
  };
  /*VALIDATION ERROR MESSAGES ENDS HERE*/
  isChecked: boolean = false;
  isRenameDDMVisible: boolean = false;
  public isLoading: boolean = false;

  hotSetting: Handsontable.GridSettings = {
    licenseKey: 'non-commercial-and-evaluation',
    afterOnCellMouseDown: (event, coords, TD) => this.afterOnCellMouseDown(event, coords, TD),
    afterValidate: (isValid: boolean, value: CellValue, row: number, prop: string | number, source: ChangeSource) => this.afterValidate(isValid, value, row, prop, source),
    afterInit: () => this.getTableHotInstance(),
    afterChange: (changes: CellChange[] | null, source: ChangeSource) => this.afterChange(changes, source),
    afterColumnMove: (columns, target) => this.afterColumnMove(columns, target),
    afterRowMove: (movedRows: number[], finalIndex: number, dropIndex: number, movePossible: boolean, orderChanged: boolean) => this.afterRowMove(movedRows, finalIndex, dropIndex, movePossible, orderChanged),
    afterLoadData: (sourceData, initialLoad) => this.afterLoadData(sourceData, initialLoad),
    invalidCellClassName: 'invalidHotTableCell',
    currentRowClassName: 'selectedRow',
    currentColClassName: 'selectedColumn',
    currentHeaderClassName: 'selectedHeader',
    colWidths: function(index) {
      return index == 0 ? 50 : 150;
    },
    manualColumnResize: true,
    manualRowResize: false,
    observeDOMVisibility: true,
    observeChanges: true,
    allowRemoveColumn: false,
    allowEmpty: true,
    fixedColumnsLeft: 2,
    comments: true,
    rowHeaders: false,
    colHeaders: (index: number) => this.colHeaders(index),
    manualColumnMove: true,
    manualRowMove: true,
    autoColumnSize: true,
    autoRowSize: true,
    hiddenColumns: {
      columns: []
    },
    contextMenu: {
      items: {

        rename: {
          key: 'rename',
          name: () => '<i> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path id="hoverBlue" d="M1.5 4.875H1.49999C1.15483 4.87504 0.875037 5.15483 0.875 5.49999V5.5V10.5V10.5C0.875037 10.8452 1.15483 11.125 1.49999 11.125H1.5H9.72656C10.0717 11.125 10.3516 10.8452 10.3516 10.5C10.3516 10.1548 10.0717 9.875 9.72656 9.875H8.12502V6.125H9.72656C10.0717 6.125 10.3516 5.84518 10.3516 5.5C10.3516 5.15482 10.0717 4.875 9.72656 4.875H1.5ZM13.7266 4.875C13.3814 4.875 13.1016 5.15483 13.1016 5.49999C13.1016 5.84518 13.3814 6.125 13.7266 6.125H13.875V9.875H13.7266C13.3814 9.875 13.1016 10.1548 13.1016 10.5C13.1016 10.8452 13.3814 11.125 13.7266 11.125H14.5C14.8452 11.125 15.125 10.8452 15.125 10.5V5.5C15.125 5.15483 14.8452 4.87504 14.5 4.875H13.7266ZM2.125 6.125H6.87502V9.875H2.125V6.125Z" fill="#888888" stroke="#888888" stroke-width="0.25"/> <path id="hoverBlue" d="M9.03914 3.50697L9.03914 3.5069C9.03369 3.15753 9.32027 2.87059 9.67187 2.87507M9.03914 3.50697L9.6728 2.87508C9.67249 2.87508 9.67218 2.87507 9.67187 2.87507M9.03914 3.50697C9.04474 3.85386 9.32701 4.1293 9.67184 4.12507M9.03914 3.50697L9.67184 4.12507M9.67187 2.87507H13.656M9.67187 2.87507H13.656M13.656 2.87507C13.8588 2.87243 14.0205 2.94795 14.1302 3.07006C14.238 3.18996 14.2891 3.34716 14.2891 3.50006C14.2891 3.65296 14.238 3.81016 14.1302 3.93006C14.0205 4.05218 13.8588 4.12769 13.656 4.12507H12.352V11.8751H13.656C13.8588 11.8724 14.0205 11.9479 14.1302 12.0701C14.238 12.19 14.2891 12.3472 14.2891 12.5001C14.2891 12.653 14.238 12.8102 14.1302 12.9301C14.0205 13.0522 13.8588 13.1277 13.656 13.1251H9.67186H9.67103V13.0001L13.656 2.87507ZM9.67184 4.12507H9.67103V4.00007L9.67274 4.12506L9.67184 4.12507ZM9.67184 4.12507H11.1019V11.8751H9.67188H9.67103V12.0001L9.67184 4.12507Z" fill="#888888" stroke="#888888" stroke-width="0.25"/> </svg> </i>  Rename field',
          callback: (key, selection, clickEvent) => {
            this.showRename(selection, clickEvent);
            event.stopImmediatePropagation();
          },
          disabled: true,
        },

        colLeft: {
          key: 'col_left',
          disabled: true,
          name: () => '<i> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12.9512 10.0928L12.9854 6.02637L6.23047 5.96963L6.19631 10.036L12.9512 10.0928Z" fill="#888888"/> <path d="M7.99411 12.8322L3.07715 8.02101L8.08531 3.30469L7.99411 12.8322Z" fill="#888888"/> </svg> </i> Insert column to left',
        },

        colRight: {
          key: 'col_right',
          disabled: true,
          name: () => '<i> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3.04881 5.90723L3.01465 9.97363L9.76953 10.0304L9.80369 5.96397L3.04881 5.90723Z" fill="#888888"/> <path d="M8.00589 3.16779L12.9229 7.97899L7.91469 12.6953L8.00589 3.16779Z" fill="#888888"/> </svg> </i> Insert column to right',
        },

        sortAscending: {
          key: 'sortAscending',
          name: () => '<i> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path id="hoverBlue" d="M2.65605 12.352C2.84805 12.64 3.26405 12.64 3.47205 12.352L5.63205 9.232C5.85605 8.912 5.63205 8.464 5.23205 8.464H3.93605V3.84C3.93605 3.616 3.76005 3.44 3.53605 3.44H2.60805C2.38405 3.44 2.20805 3.616 2.20805 3.84V8.464H0.89605C0.49605 8.464 0.27205 8.912 0.49605 9.232L2.65605 12.352Z" fill="#888888"/> <path id="hoverBlue" d="M15.1999 10.832H7.42393C7.19993 10.832 7.02393 11.008 7.02393 11.232V12.16C7.02393 12.384 7.19993 12.56 7.42393 12.56H15.1999C15.4239 12.56 15.5999 12.384 15.5999 12.16V11.232C15.5999 11.008 15.4239 10.832 15.1999 10.832Z" fill="#888888"/> <path id="hoverBlue" d="M7.42393 8.88003H13.4559C13.6799 8.88003 13.8559 8.70404 13.8559 8.48004V7.55204C13.8559 7.32804 13.6799 7.15204 13.4559 7.15204H7.42393C7.19993 7.15204 7.02393 7.32804 7.02393 7.55204V8.48004C7.02393 8.68804 7.19993 8.88003 7.42393 8.88003Z" fill="#888888"/> <path id="hoverBlue" d="M7.42393 5.18393H11.7119C11.9359 5.18393 12.1119 5.00793 12.1119 4.78393V3.85593C12.1119 3.63193 11.9359 3.45593 11.7119 3.45593H7.42393C7.19993 3.45593 7.02393 3.63193 7.02393 3.85593V4.78393C7.02393 5.00793 7.19993 5.18393 7.42393 5.18393Z" fill="#888888"/> </svg> </i> Sort ascending',
          callback: (key, selection, clickEvent) => this.sortAscending(key, selection, clickEvent)
        },

        sortDescending: {
          key: 'sortDescending',
          name: () => '<i> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path id="hoverBlue" d="M2.65605 12.352C2.84805 12.64 3.26405 12.64 3.47205 12.352L5.63205 9.232C5.85605 8.912 5.63205 8.464 5.23205 8.464H3.93605V3.84C3.93605 3.616 3.76005 3.44 3.53605 3.44H2.60805C2.38405 3.44 2.20805 3.616 2.20805 3.84V8.464H0.89605C0.49605 8.464 0.27205 8.912 0.49605 9.232L2.65605 12.352Z" fill="#888888"/> <path id="hoverBlue" d="M15.176 3.47003H7.4C7.176 3.47003 7 3.64603 7 3.87003V4.79803C7 5.02203 7.176 5.19803 7.4 5.19803H15.176C15.4 5.19803 15.576 5.02203 15.576 4.79803V3.87003C15.576 3.64603 15.4 3.47003 15.176 3.47003Z" fill="#888888"/> <path id="hoverBlue" d="M7.42393 8.88003H13.4559C13.6799 8.88003 13.8559 8.70404 13.8559 8.48004V7.55204C13.8559 7.32804 13.6799 7.15204 13.4559 7.15204H7.42393C7.19993 7.15204 7.02393 7.32804 7.02393 7.55204V8.48004C7.02393 8.68804 7.19993 8.88003 7.42393 8.88003Z" fill="#888888"/> <path id="hoverBlue" d="M7.4 12.7281H11.688C11.912 12.7281 12.088 12.5521 12.088 12.3281V11.4001C12.088 11.1761 11.912 11.0001 11.688 11.0001H7.4C7.176 11.0001 7 11.1761 7 11.4001V12.3281C7 12.5521 7.176 12.7281 7.4 12.7281Z" fill="#888888"/> </svg> </i> Sort descending',
          callback: (key, selection, clickEvent) => this.sortDescending(key, selection, clickEvent)
        },

        AddFilter: {
          key: 'AddFilter',
          name: () => '<i> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path id="hoverBlue" d="M14.96 4.22C14.96 4.66176 14.602 5.02 14.16 5.02H1.84004C1.39812 5.02 1.04004 4.66176 1.04004 4.22V3.47328C1.04004 3.03152 1.39812 2.67328 1.84004 2.67328H14.16C14.602 2.67328 14.96 3.03152 14.96 3.47328V4.22Z" fill="#888888"/> <path id="hoverBlue" d="M12.5599 8.37328C12.5599 8.8152 12.2019 9.17328 11.7599 9.17328H4.23994C3.79802 9.17328 3.43994 8.8152 3.43994 8.37328V7.62672C3.43994 7.1848 3.79802 6.82672 4.23994 6.82672H11.7599C12.2019 6.82672 12.5599 7.1848 12.5599 7.62672V8.37328Z" fill="#888888"/> <path id="hoverBlue" d="M10.1601 12.5267C10.1601 12.9685 9.80201 13.3267 9.36009 13.3267H6.64009C6.19817 13.3267 5.84009 12.9685 5.84009 12.5267V11.78C5.84009 11.3382 6.19817 10.98 6.64009 10.98H9.36009C9.80201 10.98 10.1601 11.3382 10.1601 11.78V12.5267Z" fill="#888888"/> </i> Add a filter',
          callback: (key, selection, clickEvent) => this.onClickShowAddFilter(key, selection, clickEvent)
        },

        hiddenColumns: {
          key: 'hiddenColumns',
          name: () => '<i> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path id="hoverBlue" d="M13.7067 3.70737C13.8001 3.61466 13.8743 3.50441 13.9251 3.38295C13.9758 3.26149 14.0021 3.1312 14.0023 2.99956C14.0026 2.86793 13.9769 2.73754 13.9266 2.61587C13.8763 2.49421 13.8026 2.38367 13.7095 2.29059C13.6164 2.19751 13.5059 2.12372 13.3842 2.07347C13.2625 2.02322 13.1321 1.99748 13.0005 1.99774C12.8689 1.99801 12.7386 2.02426 12.6171 2.075C12.4957 2.12573 12.3854 2.19996 12.2927 2.2934L11.5758 3.01027C10.4995 2.35104 9.26216 2.0016 8 2.00044C4.30687 2.00044 2.0531 4.61747 0.16845 7.44544C0.0586264 7.60957 0 7.8026 0 8.00009C0 8.19757 0.0586264 8.39061 0.16845 8.55474C0.922049 9.72678 1.80605 10.8096 2.80353 11.7826L2.29333 12.2928C2.19988 12.3855 2.12566 12.4957 2.07492 12.6172C2.02419 12.7387 1.99793 12.8689 1.99767 13.0006C1.99741 13.1322 2.02314 13.2626 2.0734 13.3843C2.12365 13.5059 2.19743 13.6165 2.29051 13.7096C2.38359 13.8026 2.49414 13.8764 2.6158 13.9267C2.73747 13.9769 2.86786 14.0027 2.99949 14.0024C3.13113 14.0021 3.26141 13.9759 3.38288 13.9251C3.50434 13.8744 3.61459 13.8002 3.7073 13.7067L13.7067 3.70737ZM2.21128 8.00007C4.22093 5.13209 5.87903 4.00032 8 4.00032C8.73053 3.99861 9.45216 4.16052 10.1119 4.47417L8.51315 6.07294C8.34633 6.02485 8.17361 6.00036 8 6.00019C7.46976 6.00071 6.96138 6.21158 6.58645 6.58652C6.21151 6.96146 6.00064 7.46983 6.00012 8.00007C6.0003 8.17368 6.02478 8.3464 6.07287 8.51322L4.2169 10.3692C3.46645 9.65264 2.79415 8.85849 2.21128 8.00007Z" fill="#888888"/> <path id="hoverBlue" d="M15.8315 7.44551C15.4276 6.83946 15.0013 6.24966 14.553 5.68671L13.1286 7.11106C13.3454 7.38887 13.5641 7.67986 13.7886 8.00016C11.8626 10.7489 10.255 11.8905 8.25782 11.9818L6.42847 13.8112C6.9436 13.9325 7.47069 13.9958 7.9999 13.9998C11.693 13.9998 13.9468 11.3828 15.8315 8.55479C15.9413 8.39066 15.9999 8.19763 15.9999 8.00015C15.9999 7.80267 15.9413 7.60963 15.8315 7.44551Z" fill="#888888"/> </svg> </i> Hide this field',
          callback: (key, selection, clickEvent) => this.hideFunction(selection[0].start.col, true)
        },

        delete: {
          key: 'delete',
          name: () => '<i> <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path id="activeBlue" d="M1.82322 3.37946H13.1986C13.6477 3.37946 14.0218 3.75365 14.0218 4.20268V5.51234C14.0218 5.96137 13.6477 6.33556 13.1986 6.33556H12.9741V14.6426C12.9741 15.9523 11.889 17 10.5793 17H4.44256C3.13289 17 2.08515 15.9523 2.08515 14.6426V6.33556H1.82322C1.37419 6.33556 1 5.96137 1 5.51234V4.20268C1 3.75365 1.37419 3.37946 1.82322 3.37946ZM12.0012 6.33556H3.02063V14.6426C3.02063 15.4284 3.65676 16.0645 4.44256 16.0645H10.5793C11.3651 16.0645 12.0012 15.4284 12.0012 14.6426V6.33556ZM13.0864 4.35235H1.93548V5.40009H13.0864V4.35235Z" fill="#888888" stroke="#888888" stroke-width="0.5"/> <path id="activeBlue"  d="M4.96655 7.99737C4.96655 7.73544 5.19107 7.54834 5.453 7.54834C5.71494 7.54834 5.90203 7.73544 5.90203 7.99737V12.9741C5.90203 13.236 5.71494 13.4606 5.453 13.4606C5.19107 13.4606 4.96655 13.236 4.96655 12.9741V7.99737Z" fill="#888888" stroke="#888888" stroke-width="0.5"/> <path id="activeBlue"  d="M7.02441 7.99737C7.02441 7.73544 7.24893 7.54834 7.51086 7.54834C7.7728 7.54834 7.99731 7.73544 7.99731 7.99737V12.9741C7.99731 13.236 7.7728 13.4606 7.51086 13.4606C7.24893 13.4606 7.02441 13.236 7.02441 12.9741V7.99737Z" fill="#888888" stroke="#888888" stroke-width="0.5"/> <path id="activeBlue"  d="M9.11987 7.99737C9.11987 7.73544 9.30697 7.54834 9.5689 7.54834C9.83084 7.54834 10.0554 7.73544 10.0554 7.99737V12.9741C10.0554 13.236 9.83084 13.4606 9.5689 13.4606C9.30697 13.4606 9.11987 13.236 9.11987 12.9741V7.99737Z" fill="#888888" stroke="#888888" stroke-width="0.5"/> <path id="activeBlue"  d="M5.453 1.93548C5.19107 1.93548 4.96655 1.74838 4.96655 1.48645C4.96655 1.22451 5.19107 1 5.453 1H9.5691C9.83104 1 10.0556 1.22451 10.0556 1.48645C10.0556 1.74838 9.83104 1.93548 9.5691 1.93548H5.453Z" fill="#888888" stroke="#888888" stroke-width="0.5"/> </svg> </i> Delete this field',
          callback: (key, selection, clickEvent) => this.log(key, selection, clickEvent),
          disabled: true
        },

      },
    },
  };

  isValidCellData: boolean;
  showNoTagsMsg: boolean = false;
  private hotRegisterer = new HotTableRegisterer();
  private hotInstance: Handsontable;
  col: any = {};
  colIndex: number = -1;
  dataIndex: number = -1;
  selectedRowData: any;
  searchTag: string;
  invalidTagSearch: boolean = false;
  @ViewChild('overlayDomEl') overlayDomEl: ElementRef;
  @ViewChild('renameEl') renameEl: ElementRef;
  private cdkOverlayRef: OverlayRef;

  @Input() dataSet: any[] = [];
  @Input() colSet: ProspectColumn[] = [];
  @Input() hotId: any;
  @Output() hideField: EventEmitter<any> = new EventEmitter<any>();
  @Output() showFilter: EventEmitter<any> = new EventEmitter<any>();


  ngOnInit(): void {
    this.getTableHotInstance();
  }

  afterLoadData(sourceData: CellValue[], initialLoad: boolean): void {
    this.tableMenuService.dataLoaded = sourceData.length === 0 ? true : false;
    console.log(this.tableMenuService.dataLoaded);
  }

  hideFunction(index: number, hidden: boolean): void {
    this.tableMenuService.hiddenColumns.push(index);
    this.tableMenuService.prospectColumnWithoutCheckedColumn.find(column => column.colId === index).hidden = true;
    this.hotInstance.updateSettings({hiddenColumns: {columns: this.tableMenuService.hiddenColumns}});
    this.tableMenuService.prospectColumn[index].hidden = true;
    this.tableMenuService.totalColumnHidden = this.tableMenuService.hiddenColumns.length;
    this.hideField.emit(true);
    this.prospectService.updateHiddenStatus(index).subscribe(response => {
      /*this.tableMenuService.prospectColumnWithoutCheckedColumn.find(column => column.colId === index).hidden = response.object.hidden;
      this.tableMenuService.onHiddenHotCols();
      this.hotInstance.updateSettings({});*/
      /*this.checkIsAllHidden();
      this.checkIsAllShown();*/
    }, error => {
      console.log(error);
    });
  }

  onClickShowAddFilter(key: string, selection: Handsontable.contextMenu.Selection[], clickEvent: MouseEvent): void {
    // this.tableMenuComponent.onClickShowAddFilter();
    // this.addAndUpdateFilter(selection);
    this.showFilter.emit(true);
  }

  addAndUpdateFilter(selection: any): void {
    const addFilter = this.prospectService.defaultFilter;
    addFilter.andOr = this.prospectService.andOrStatus;
    const tempArr = [];
    // console.log(this.tableMenuService.listOfData);
    for (const listOfData of this.prospectService.originalProspectDataset) {
      if (tempArr.indexOf(listOfData[this.prospectService.prospectColumn[selection[0].start.col].field]) === -1) {
        tempArr.push(listOfData[this.prospectService.prospectColumn[selection[0].start.col].field]);
      }
    }
    addFilter.fieldName = this.prospectService.prospectColumn[selection[0].start.col].field;
    addFilter.searchFilter.searchFilterArray = tempArr;
    addFilter.selectedCol.name = this.prospectService.prospectColumn[selection[0].start.col].title;
    addFilter.selectedCol.icon = this.prospectService.prospectColumn[selection[0].start.col].icon;
    const filterRequestList = new Filter();
    filterRequestList.columnValue = '';
    filterRequestList.clauseType = 'contains';
    filterRequestList.columnName = this.prospectService.prospectColumn[selection[0].start.col].field;
    this.prospectService.commonFilterRequest.type = this.prospectService.andOrStatus;
    this.prospectService.commonFilterRequest.filterClass = 'ProspectorModel';
    this.prospectService.commonFilterRequest.filterRequstList.push(filterRequestList);
    this.prospectService.filterArray.push(JSON.parse(JSON.stringify(addFilter)));
    // this.showFilter.emit(true);
  }

  showRename(selection, clickEvent): void {
    event.stopImmediatePropagation();
    this.isRenameDDMVisible = true;
    const domRect = clickEvent.target.getBoundingClientRect();
    console.log(domRect);
    console.log(this.isRenameDDMVisible);
    console.log(this.renameEl);
    setTimeout(() => {
      console.log(domRect);
      console.log(this.isRenameDDMVisible);
      console.log(this.renameEl);
      this.renameEl.nativeElement.style.display = 'block';
      this.renameEl.nativeElement.style.position = 'absolute';
      this.renameEl.nativeElement.style.top = domRect.top + 'px';
      this.renameEl.nativeElement.style.left = domRect.left + 'px';
      this.renameEl.nativeElement.style.right = domRect.right + 'px';
    }, 100);
  }

  renameField(): void {
    this.isRenameDDMVisible = false;
  }

  cancelRename(): void {
    this.isRenameDDMVisible = false;
  }

  sortAscending(key, selection, clickEvent): void {
    const sortByRequestBody: SortByReq = new SortByReq();
    sortByRequestBody.ascOrDesc = 'asc';
    sortByRequestBody.userId = this.prospectService.userId;
    sortByRequestBody.companyId = this.prospectService.companyId;
    sortByRequestBody.colType = 'inbuilt';
    sortByRequestBody.colId = this.prospectService.prospectColumn[selection[0].start.col].colId;
    this.prospectService.sortByRequest = sortByRequestBody;
    this.applySort(sortByRequestBody);
    this.tableMenuService.columnNameSortBy =
      this.prospectService.prospectColumn[selection[0].start.col].title;
    this.tableMenuService.columnIconSortBy =
      this.prospectService.prospectColumn[selection[0].start.col].icon;
    this.tableMenuService.sortActive = true;
  }

  applySort(sortRequest: SortByReq): void{
    const commonFilterRequest = this.prospectService.commonFilterRequest.filterRequstList.length !== 0 ? this.prospectService.commonFilterRequest : null;
    const sortByRequest = new SortByRequest();
    sortByRequest.commonFilterRequest = commonFilterRequest;
    sortByRequest.sortByReq = sortRequest;
    this.prospectService.getAllProspectData(this.prospectService.selectedTable.tableId, 1, sortByRequest).subscribe(response => {
      this.dataSet = response.list;
      this.hotInstance.updateSettings({data: this.dataSet});
      /*this.hotInstance.render();*/
      // this.isSortingLoading = false;
      // this.sortByDDMVisibility$.next(false);
    }, error => {
      console.log(error);
    });
  }

  sortDescending(key, selection, clickEvent): void {
    const sortByRequestBody: SortByReq = new SortByReq();
    sortByRequestBody.ascOrDesc = 'desc';
    sortByRequestBody.userId = this.prospectService.userId;
    sortByRequestBody.companyId = this.prospectService.companyId;
    sortByRequestBody.colType = 'inbuilt';
    sortByRequestBody.colId = this.prospectService.prospectColumn[selection[0].start.col].colId;
    this.prospectService.sortByRequest = sortByRequestBody;
    this.applySort(sortByRequestBody);
  }

  log(key, selection, clickEvent): void {
    // console.log(key);
    // console.log(selection);
    // console.log(clickEvent);
  }

  renameDisabled(): void {

  }

  getTableHotInstance(): void {
    this.hotInstance = this.hotRegisterer.getInstance(this.hotId);
    this.tableMenuService.hotInstance = this.hotInstance;
    this.tableMenuService.onHiddenHotCols();
    setTimeout(() => {
      // this.hotInstance.validateCells(); // TODO Hide fields were getting distorted
    }, 2000);

  }

  onHideColumn(hiddenHotCols: any[]): void {
    /*
        console.log(hiddenHotCols);
    */
    /*if (this.hotInstance) {
      this.hotInstance.updateSettings({
        hiddenColumns: {
          columns: hiddenHotCols
        }
      });
    }*/
  }


  colHeaders(index: number) {
    if (index == 0) {
      let txt = '<input type="checkbox" class="checker" ';
      txt += this.isChecked ? 'checked="checked"' : '';
      txt += '>';
      return txt;
    }
  }

  rerenderHotTable(): void {
    console.log('rerenderHotTable');
    setTimeout(() => {
      this.hotInstance.render();
    }, 10);
  }


  afterOnCellMouseDown(event, coords, TD): void {
    coords.col === 0 ? this.prospectService.isCheckboxActive = true : this.prospectService.isCheckboxActive = false;
    if (event.target.className === 'checker') {
      this.isChecked = !event.target.checked;
      if (this.isChecked) {
        for (let i = 0; i < this.hotInstance.countRows(); i++) {
          let td = this.hotInstance.getCell(i, coords.col);
          this.dataSet[i]['checked'] = true;
          td.innerHTML = '<input type="checkbox" checked>';
        }
      } else {
        for (let i = 0; i < this.hotInstance.countRows(); i++) {
          let td = this.hotInstance.getCell(i, coords.col);
          this.dataSet[i]['checked'] = false;
          td.innerHTML = '<input type="checkbox">';
        }
      }
    }
    this.col = this.prospectService.prospectColumn[coords.col];
    this.selectedRowData = this.dataSet[coords.row];
    this.colIndex = coords.col;
    this.dataIndex = coords.row;
    this.prospectService.currentHotCol = coords.col;
    this.prospectService.currentHotRow = coords.row;
    if (event.target.className === 'checkbox' || event.target.className === 'customTableCheckBox') {
      console.log(event.target.checked);
      this.selectedRowData.checked = !event.target.checked;
      console.log(this.selectedRowData);
    }

    if (this.col !== undefined) {
      if (this.col.type === 'singleSelectTag' &&
        (event.target.nodeName === 'BUTTON' || event.target.nodeName === 'svg' || event.target.nodeName === 'path')) {
        this.deleteSingleSelectTag();
      }
      if (this.col.type === 'multiSelectTag' &&
        (event.target.nodeName === 'BUTTON' || event.target.nodeName === 'svg' || event.target.nodeName === 'path')) {
        const tagValue = event.target.closest('div').innerText;
        this.deleteMultiSelectTag(tagValue);
      }

      const domRect = TD.getBoundingClientRect();

      TD.ondblclick = () => {
        if (this.col.type === 'singleSelectTag' || this.col.type === 'multiSelectTag') {
          this.showOverlayDomEl(domRect);
        }
        if (this.col.type === 'multiLineText') {
          this.openFroalaModal();
        }
      };
    }
  }

  openFroalaModal() {
    this.nzModalService.create({
      nzContent: FroalaEditorComponent,
      nzMask: false,
      nzFooter: null,
      nzClosable: false,
      nzMaskClosable: true,
      nzWrapClassName: 'center-modal',
      nzOnOk: (froalaEditorComponentInstance) => this.onSubmitFroalaEditor(froalaEditorComponentInstance),
      nzComponentParams: {
        froalaEditorContent: this.selectedRowData[this.col.field]
      }
    });
  }

  onSubmitFroalaEditor(froalaEditorComponentInstance: any) {
    this.selectedRowData[this.col.field] = froalaEditorComponentInstance.froalaEditorContent;
    console.log(this.selectedRowData);
  }

  showOverlayDomEl(domRect: DOMRect): void {
    this.overlayDomEl.nativeElement.style.display = 'block';
    this.overlayDomEl.nativeElement.style.position = 'absolute';
    this.overlayDomEl.nativeElement.style.width = domRect.width + 'px';
    this.overlayDomEl.nativeElement.style.top = domRect.top + 'px';
    this.overlayDomEl.nativeElement.style.right = domRect.right + 'px';
    this.overlayDomEl.nativeElement.style.left = domRect.left + 'px';

    this.cdkOverlayRef = this.cdkOverlay.create({
      hasBackdrop: true
    });
    const domPortal = new DomPortal(this.overlayDomEl);
    this.cdkOverlayRef.attach(domPortal);
    this.cdkOverlayRef.backdropClick().subscribe(cdkObserver => this.closeCdkOverlay());
    this.cdkOverlayRef.keydownEvents().subscribe(event => {
      if (event.key == 'Escape') {
        this.closeCdkOverlay();
      }
    });
  }

  closeCdkOverlay(): void {
    this.prospectService.currentHotRow = -1;
    this.cdkOverlayRef.detach();
    this.cdkOverlayRef.detachBackdrop();
  }

  deleteMultiSelectTag(tagValue: string): void {
    console.log(tagValue);
    const index = this.selectedRowData[this.col.field].indexOf(tagValue);
    this.selectedRowData[this.col.field].splice(index, 1);
  }

  deleteSingleSelectTag(): void {
    console.log(this.col.field);
    this.selectedRowData[this.col.field] = '';
    console.log(this.selectedRowData);
  }

  checkBoxRenderer(instance, td, row, col, prop, value, cellProperties): void {
    Handsontable.renderers.CheckboxRenderer.apply(this, arguments);
    let renderHTML: string = '';
    if (value) {
      renderHTML = `<input class='customTableCheckBox' type='checkbox' checked>`;
    } else {
      renderHTML = `<div class='checkbox-renderer'><span>${row + 1}</span><span><input type='checkbox' class="checkbox"></span></div>`;
    }
    td.innerHTML = renderHTML;
    return td;
  }

  validatorRenderer(instance, td, row, col, prop, value, cellProperties): void {
    Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    let renderHTML: string = '';
    if (value) {
      if (td.classList.contains('invalidHotTableCell')) {
        renderHTML += `
                    ${value}
                    <i class="errorIcon">${cellErrorIcon}</i>
                    `;
      } else {
        renderHTML += `${value}`;
      }
    }
    td.innerHTML = renderHTML;
  }


  singleSelectTagsRenderer(instance, td, row, col, prop, value, cellProperties): void {
    Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    let renderHTML: string = '';
    const tag = value;
    if (tag) {
      let h = 0, l = tag.length, i = 0;
      if (l > 0) {
        while (i < l) {
          h = (h << 5) - h + tag.charCodeAt(i++) | 0;
        }
      }
      const uniqueCode = Math.abs(h) % 10;
      const closeSVGIcon = `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" class="closeIcon cursorPointer"><path d="M6.62394 7.6728L3.99994 5.0496L1.37594 7.6728C1.30718 7.74186 1.22546 7.79665 1.13547 7.83404C1.04548 7.87143 0.948987 7.89068 0.851537 7.89068C0.754087 7.89068 0.657597 7.87143 0.567606 7.83404C0.477614 7.79665 0.395894 7.74186 0.327137 7.6728C0.25808 7.60404 0.203282 7.52232 0.165892 7.43233C0.128501 7.34234 0.109253 7.24585 0.109253 7.1484C0.109253 7.05095 0.128501 6.95446 0.165892 6.86447C0.203282 6.77448 0.25808 6.69276 0.327137 6.624L2.95034 4L0.327137 1.376C0.25808 1.30724 0.203282 1.22552 0.165892 1.13553C0.128501 1.04554 0.109253 0.949048 0.109253 0.851598C0.109253 0.754148 0.128501 0.657658 0.165892 0.567667C0.203282 0.477675 0.25808 0.395955 0.327137 0.327198C0.395894 0.258141 0.477614 0.203343 0.567606 0.165953C0.657597 0.128562 0.754087 0.109314 0.851537 0.109314C0.948987 0.109314 1.04548 0.128562 1.13547 0.165953C1.22546 0.203343 1.30718 0.258141 1.37594 0.327198L3.99994 2.9504L6.62394 0.327198C6.69269 0.258141 6.77441 0.203343 6.86441 0.165953C6.9544 0.128562 7.05089 0.109314 7.14834 0.109314C7.24579 0.109314 7.34228 0.128562 7.43227 0.165953C7.52226 0.203343 7.60398 0.258141 7.67274 0.327198C7.7418 0.395955 7.79659 0.477675 7.83398 0.567667C7.87137 0.657658 7.89062 0.754148 7.89062 0.851598C7.89062 0.949048 7.87137 1.04554 7.83398 1.13553C7.79659 1.22552 7.7418 1.30724 7.67274 1.376L5.04954 4L7.67274 6.624C7.7418 6.69276 7.79659 6.77448 7.83398 6.86447C7.87137 6.95446 7.89062 7.05095 7.89062 7.1484C7.89062 7.24585 7.87137 7.34234 7.83398 7.43233C7.79659 7.52232 7.7418 7.60404 7.67274 7.6728C7.60398 7.74186 7.52226 7.79665 7.43227 7.83404C7.34228 7.87143 7.24579 7.89068 7.14834 7.89068C7.05089 7.89068 6.9544 7.87143 6.86441 7.83404C6.77441 7.79665 6.69269 7.74186 6.62394 7.6728Z" fill="${colorCode[uniqueCode]}"></path></svg>`;
      renderHTML += `<div class="selectedTagSection" style="background:${backGround[uniqueCode]}; border: 1px solid ${colorCode[uniqueCode]}; color: ${colorCode[uniqueCode]}">
                           <div class="selectedTagText"> ${tag} </div>
                           <button class="clearItemIcon"> <i> ${closeSVGIcon}</i> </button>
                       </div>`;
    }
    td.innerHTML = '<div class="multiSelectedTagDiv">' + renderHTML + '</div>';
    return td;
  }


  multiSelectTagsRenderer(instance, td, row, col, prop, value, cellProperties): void {
    Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    let renderHTML: string = '';
    if (value) {
      value.forEach(tag => {
        let h = 0, l = tag.length, i = 0;
        if (l > 0) {
          while (i < l) {
            h = (h << 5) - h + tag.charCodeAt(i++) | 0;
          }
        }
        const uniqueCode = Math.abs(h) % 10;
        const closeSVGIcon = `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" class="closeIcon cursorPointer"><path d="M6.62394 7.6728L3.99994 5.0496L1.37594 7.6728C1.30718 7.74186 1.22546 7.79665 1.13547 7.83404C1.04548 7.87143 0.948987 7.89068 0.851537 7.89068C0.754087 7.89068 0.657597 7.87143 0.567606 7.83404C0.477614 7.79665 0.395894 7.74186 0.327137 7.6728C0.25808 7.60404 0.203282 7.52232 0.165892 7.43233C0.128501 7.34234 0.109253 7.24585 0.109253 7.1484C0.109253 7.05095 0.128501 6.95446 0.165892 6.86447C0.203282 6.77448 0.25808 6.69276 0.327137 6.624L2.95034 4L0.327137 1.376C0.25808 1.30724 0.203282 1.22552 0.165892 1.13553C0.128501 1.04554 0.109253 0.949048 0.109253 0.851598C0.109253 0.754148 0.128501 0.657658 0.165892 0.567667C0.203282 0.477675 0.25808 0.395955 0.327137 0.327198C0.395894 0.258141 0.477614 0.203343 0.567606 0.165953C0.657597 0.128562 0.754087 0.109314 0.851537 0.109314C0.948987 0.109314 1.04548 0.128562 1.13547 0.165953C1.22546 0.203343 1.30718 0.258141 1.37594 0.327198L3.99994 2.9504L6.62394 0.327198C6.69269 0.258141 6.77441 0.203343 6.86441 0.165953C6.9544 0.128562 7.05089 0.109314 7.14834 0.109314C7.24579 0.109314 7.34228 0.128562 7.43227 0.165953C7.52226 0.203343 7.60398 0.258141 7.67274 0.327198C7.7418 0.395955 7.79659 0.477675 7.83398 0.567667C7.87137 0.657658 7.89062 0.754148 7.89062 0.851598C7.89062 0.949048 7.87137 1.04554 7.83398 1.13553C7.79659 1.22552 7.7418 1.30724 7.67274 1.376L5.04954 4L7.67274 6.624C7.7418 6.69276 7.79659 6.77448 7.83398 6.86447C7.87137 6.95446 7.89062 7.05095 7.89062 7.1484C7.89062 7.24585 7.87137 7.34234 7.83398 7.43233C7.79659 7.52232 7.7418 7.60404 7.67274 7.6728C7.60398 7.74186 7.52226 7.79665 7.43227 7.83404C7.34228 7.87143 7.24579 7.89068 7.14834 7.89068C7.05089 7.89068 6.9544 7.87143 6.86441 7.83404C6.77441 7.79665 6.69269 7.74186 6.62394 7.6728Z" fill="${colorCode[uniqueCode]}"></path></svg>`;
        renderHTML += `<div class="selectedTagSection" style="background:${backGround[uniqueCode]}; border: 1px solid ${colorCode[uniqueCode]}; color: ${colorCode[uniqueCode]}">
                           <div class="selectedTagText"> ${tag} </div>
                           <button class="clearItemIcon"> <i> ${closeSVGIcon}</i> </button>
                       </div>`;
      });
    }
    td.innerHTML = '<div class="multiSelectedTagDiv">' + renderHTML + '</div>';
    return td;
  }

  multiLineTextRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    td.innerHTML = Handsontable.helper.stringify(value).replace(/(<([^>]+)>)/gi, '');
  }

  emailValidator(value, callback) {
    if (value) {
      const emailValidatorRegex = new RegExp(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/);
      emailValidatorRegex.test(value) ? callback(true) : callback(false);
    } else {
      callback(true);
    }
  }

  urlValidator(value, callback) {
    if (value) {
      const urlValidatorRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&\/=]*)/);
      urlValidatorRegex.test(value) ? callback(true) : callback(false);
    } else {
      callback(true);
    }
  }

  textValidator(value, callback) {
    if (value) {
      const textValidatorRegex = new RegExp(/^([^0-9]*)$/);
      textValidatorRegex.test(value) ? callback(true) : callback(false);
    } else {
      callback(true);
    }
  }

  onCreateNewTag(searchTag: string): void {
    console.log(this.prospectService.allTagOptions);
    console.log(searchTag);
    this.prospectService.allTagOptions[this.col.field].push(searchTag);
    const tagOption = new TagOptions();
    tagOption.tagOptions = this.prospectService.allTagOptions[this.col.field];
    tagOption.tagName = this.col.field;
    this.prospectService.addTagOptions(tagOption).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
    console.log(this.prospectService.allTagOptions[this.col.field]);
    this.invalidTagSearch = false;
    this.searchTag = undefined;
  }

  onChangeSearchTag(searchTag: string) {
    this.arrayFilterPipe.transform(this.prospectService.allTagOptions[this.col.field], searchTag).length == 0 ? this.invalidTagSearch = true : this.invalidTagSearch = false;
  }


  onSelectTag(tag: string): void {
    if (this.col.type == 'singleSelectTag') {
      this.selectedRowData[this.col.field] = tag;
    } else {
      this.selectedRowData[this.col.field].push(tag);
    }
    this.closeCdkOverlay();
  }

  beforeKeyDown(event): void {
    if (event.key == 'Enter') {
      let row = this.hotInstance.getSelectedLast()[0];
      let col = this.hotInstance.getSelectedLast()[1];
      this.colIndex = col;
      this.dataIndex = row;
      this.prospectService.currentHotCol = col;
      this.prospectService.currentHotRow = row;
      this.col = this.prospectService.prospectColumn[col];
      let TD = this.hotInstance.getCell(row, col);
      const domRect = TD.getBoundingClientRect();
      if (this.col.type === 'singleSelectTag' || this.col.type === 'multiSelectTag') {
        setTimeout(() => {
          this.showOverlayDomEl(domRect);
        }, 100);
        event.stopImmediatePropagation();
      }
      if (this.col.type === 'multiLineText') {
        this.openFroalaModal();
        event.stopImmediatePropagation();
      }
    }
  }

  afterChange(changes, source): void {
    if (this.isValidCellData || this.isValidCellData == undefined) {
      if (this.selectedRowData && changes[0][3]) {
        this.onUpdateProspect();
      }
    }
  }

  onUpdateProspect() {
    this.prospectService.updateProspects(this.selectedRowData).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  public afterColumnMove(columns: number[], target: number) {
    if (columns[0] !== target) {
      this.onDragColumn(columns[0], target);
    }
    const element = this.prospectService.prospectColumn[columns[0]];
    this.prospectService.prospectColumn.splice(columns[0], 1);
    this.prospectService.prospectColumn.splice(target, 0, element);
  }

  onDragColumn(previousIndex: number, currentIndex: number) {
    this.prospectService.prospectColumn[previousIndex].sequence = currentIndex + 2;
    this.prospectService.prospectColumn[currentIndex].sequence = previousIndex + 2;
    this.prospectService.updateInbuiltColumnMapping(this.prospectService.prospectColumn[previousIndex]).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
    this.prospectService.updateInbuiltColumnMapping(this.prospectService.prospectColumn[currentIndex]).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  private afterRowMove(movedRows: number[], finalIndex: number, dropIndex: number, movePossible: boolean, orderChanged: boolean) {
    this.onDragRow(movedRows[0], finalIndex);
  }

  onDragRow(previousIndex: number, currentIndex: number) {
    this.dataSet[previousIndex].sequence = currentIndex + 1;
    this.dataSet[currentIndex].sequence = previousIndex + 1;
    /*TODO => api call goes here*/
  }

  private afterValidate(isValid, value, row, prop, source): void {
    // const col = this.hotInstance.propToCol(prop);
    this.isValidCellData = isValid;
   /* if (!isValid) {
      this.hotInstance.getPlugin('comments').setCommentAtCell(row, col, this.errorMessages[this.prospectService.prospectColumn[col].type]);
      this.hotInstance.getPlugin('comments').updateCommentMeta(row, col, {readOnly: true});
    }
    if (isValid) {
      if (this.hotInstance.getPlugin('comments').getCommentAtCell(row, col)) {
        this.hotInstance.getPlugin('comments').removeCommentAtCell(row, col);
      }
    }*/
  }

  @HostListener('document:keydown.escape', ['$event']) onESCKeydownHandler(event: KeyboardEvent) {
    if (this.tableMenuService.isFullScreen) {
      this.tableMenuService.isFullScreen = false;
    }
  }

  checkBoxClicked(): void {
    console.log('checkBoxClicked');
  }

  trackByFn(index): void {
    return index;
  }

}
