import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProspectService} from './prospect.service';
import {AddTableRequest, Segment, SegmentRequest, SegmentView, TableModel} from './models/prospect-model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-prospect',
  templateUrl: './prospect.component.html',
  styleUrls: ['./prospect.component.css']
})
export class ProspectComponent implements OnInit {

  constructor(private router: Router, private prospectService: ProspectService) {
  }

  hideMenuIcon = 'assets/table/hideNavigationMenuBlack.svg';



  /*LOADER BOOLEAN VARIABLE STARTS HERE*/
  isAddNewSegmentLoading: boolean = false;
  isAddNewTableLoading: boolean = false;
  isEditSegmentLoading: boolean = false;
  isEditSegmentEmojiChanged: boolean = false;
  isDeleteSegmentLoading: boolean = false;
  /*LOADER BOOLEAN VARIABLE ENDS HERE*/

  /*MODAL VISIBILITY RELATED VARIABLES STARTS HERE*/
  addNewSegmentModalVisible: boolean = false;
  addNewTableModalVisible: boolean = false;
  isSegmentDDMVisible: boolean = false;
  deleteSegmentModalVisible: boolean = false;
  editSegmentModalVisible: boolean = false;
  isViewDDMVisible = false;
  gridView = false;
  listView = true;
  /*MODAL VISIBILITY RELATED VARIABLES ENDS HERE*/

  leftSidebarCollapse: boolean = true;

  /*TEMPLATE REF AMD VIEW CHILD VARIABLES STARTS HERE*/
  @ViewChild('newSegmentDescriptionEl') newSegmentDescriptionEl: ElementRef;
  /*TEMPLATE REF AMD VIEW CHILD VARIABLES ENDS HERE*/

  /*ERROR RELATED BOOLEAN FLAGS STARTS HERE*/
  segmentNameAlreadyExistsError: boolean = false;
  tableNameAlreadyExistsError: boolean = false;
  editSegmentNameAlreadyExistsError: boolean = false;
  /*ERROR RELATED BOOLEAN FLAGS ENDS HERE*/


  showSegmentEmoji = false;
  showEditEmoji = false;
  showTableEmoji = false;
  showColorDDM = false;
  radioValue = 'cardView';

  /*SEGMENT RELATED VARIABLES STARS HERE*/
  segments: Segment[] = [];
  searchSegmentName: string;
  newSegmentName: string;
  newSegmentDescription: string;
  segmentToBeDeleted: Segment;
  segmentToBeEdited: Segment;
  currentSegmentIndex: number = -1;
  /*SEGMENT RELATED VARIABLES ENDS HERE*/

  /*TABLE RELATED VARIABLES STARTS HERE*/
  newTableName: string;
  newTableSegmentId: number;
  /*TABLE RELATED VARIABLES ENDS HERE*/


  /*COLOR PALETTE & EMOJI VARIABLES STARTS HERE*/
  customColorPalette = [
    'rgba(207, 223, 255, 1)', 'rgba(156, 199, 255, 1)', 'rgba(45, 127, 249, 1)', 'rgba(0, 103, 255, 1)', 'rgba(0, 84, 209, 1)',
    'rgba(208, 240, 253, 1)', 'rgba(119, 209, 243, 1)', 'rgba(24, 191, 255, 1)', 'rgba(64, 131, 172, 1)', 'rgba(11, 118, 183, 1)',
    'rgba(194, 245, 233, 1)', 'rgba(114, 221, 195, 1)', 'rgba(32, 217, 210, 1)', 'rgba(123, 200, 195, 1)', 'rgba(6, 160, 155, 1)',
    'rgba(255, 179, 200, 1)', 'rgba(255, 140, 173, 1)', 'rgba(255, 140, 173, 1)', 'rgba(255, 0, 73, 1)', 'rgba(218, 2, 64, 1)',
    'rgba(255, 227, 175, 1)', 'rgba(255, 214, 140, 1)', 'rgba(255, 197, 92, 1)', 'rgba(253, 178, 43, 1)', 'rgba(232, 149, 0, 1)',
    'rgba(255, 159, 242, 1)', 'rgba(254, 103, 233, 1)', 'rgba(246, 56, 220, 1)', 'rgba(255, 0, 220, 1)', 'rgba(214, 0, 184, 1)',
    'rgba(255, 181, 152, 1)', 'rgba(255, 158, 121, 1)', 'rgba(255, 120, 68, 1)', 'rgba(255, 71, 0, 1)', 'rgba(197, 55, 0, 1)',
    'rgba(175, 181, 255, 1)', 'rgba(142, 150, 255, 1)', 'rgba(107, 118, 255, 1)', 'rgba(49, 64, 255, 1)', 'rgba(0, 19, 255, 1)',
    'rgba(131, 204, 139, 1)', 'rgba(97, 199, 108, 1)', 'rgba(32, 201, 51, 1)', 'rgba(0, 181, 20, 1)', 'rgba(51, 138, 23, 1)',
    'rgba(238, 238, 238, 1)', 'rgba(204, 204, 204, 1)', 'rgba(172, 172, 172, 1)', 'rgba(102, 102, 102, 1)', 'rgba(68, 68, 68, 1)'
  ];
  customEmojiPalette = ['cyclone', 'rocket', 'gear', 'spock-hand', 'i_love_you_hand_sign', 'blossom', 'bell', 'calendar', 'star', 'octagonal_sign', 'dart', 'frog', 'pushpin', 'tada'];
  selectedTableColor: string = this.customColorPalette[Math.floor(Math.random() * this.customColorPalette.length)];
  selectedSegmentEmoji: string = this.customEmojiPalette[Math.floor(Math.random() * this.customEmojiPalette.length)];
  selectedTableEmoji: string = this.customEmojiPalette[Math.floor(Math.random() * this.customEmojiPalette.length)];
  /*COLOR PALETTE & EMOJI VARIABLES ENDS HERE*/

  ngOnInit(): void {
    this.getAllSegments();
    this.getSegmentView();
  }

  hideBlueSvg(): void {
    this.hideMenuIcon = 'assets/table/hideNavigationMenuBlue.svg';
  }

  hideBlackSvg(): void {
    this.hideMenuIcon = 'assets/table/hideNavigationMenuBlack.svg';
  }

  getAllSegments(): void {
    this.prospectService.getAllSegments().subscribe(data => {
      console.log(data);
      this.segments = data.list;
    }, error => {
      console.log(error);
    });
  }

  addNewSegmentModal(): void {
    this.addNewSegmentModalVisible = true;
    this.selectedSegmentEmoji = this.customEmojiPalette[Math.floor(Math.random() * this.customEmojiPalette.length)];
  }

  addNewTableModal(segmentId: number): void {
    this.addNewTableModalVisible = true;
    this.newTableSegmentId = segmentId;
    this.selectedTableColor = this.customColorPalette[Math.floor(Math.random() * this.customColorPalette.length)];
    this.selectedTableEmoji = this.customEmojiPalette[Math.floor(Math.random() * this.customEmojiPalette.length)];
  }

  deleteSegmentOpenModel(segmentToBeDeleted: Segment): void {
    this.segmentToBeDeleted = segmentToBeDeleted;
    this.deleteSegmentModalVisible = true;
  }

  addNewSegment(segmentName: string, segmentDescription: string): void {
    this.isAddNewSegmentLoading = true;
    const addSegmentRequest = new SegmentRequest();
    addSegmentRequest.segmentName = segmentName;
    addSegmentRequest.description = segmentDescription;
    addSegmentRequest.emoji = this.selectedSegmentEmoji;
    this.prospectService.saveSegment(addSegmentRequest).subscribe(data => {
      this.segments.push(data.object);
      this.isAddNewSegmentLoading = false;
      this.resetAddNewSegmentModalData();
    }, error => {
      console.log(error);
      this.isAddNewSegmentLoading = false;
    });
  }

  addNewTable(tableName: string): void {
    console.log(this.newTableSegmentId);
    this.isAddNewTableLoading = true;
    const addTableRequest = new AddTableRequest();
    addTableRequest.name = tableName;
    addTableRequest.segmentId = this.newTableSegmentId;
    addTableRequest.color = this.selectedTableColor;
    addTableRequest.emoji = this.selectedTableEmoji;
    console.log(addTableRequest);
    this.prospectService.saveTable(addTableRequest).subscribe(data => {
      const responseTableModel: TableModel = data.object;
      console.log(data);
      const index = this.segments.findIndex(segment => segment.segmentId === responseTableModel.segmentId);
      this.segments[index].tableModelList.push(responseTableModel);
      this.isAddNewTableLoading = false;
      this.resetAddNewTableModalData();
    }, error => {
      console.log(error);
      this.isAddNewTableLoading = false;
    });
  }

  selectSegmentEmoji($event): void {
    this.selectedSegmentEmoji = $event.emoji.id;
    this.showSegmentEmoji = false;
  }

  selectTableEmoji($event): void {
    this.selectedTableEmoji = $event.emoji.id;
    this.showTableEmoji = false;
  }

  editSegmentEmoji($event): void {
    this.segmentToBeEdited.emoji = $event.emoji.id;
    this.showEditEmoji = false;
    this.isEditSegmentEmojiChanged = true;
  }

  onVisibleChangeSegmentDDM(event, index): void {
    this.isSegmentDDMVisible = event;
    event ? this.currentSegmentIndex = index : this.currentSegmentIndex = -1;
  }

  deleteSegmentFinal(segmentId: number): void {
    this.isDeleteSegmentLoading = true;
    this.prospectService.deleteSegment(segmentId).subscribe(data => {
      console.log(data);
      if (data.responseCodeJson.code == 200) {
        const index = this.segments.findIndex(x => x.segmentId === segmentId);
        this.segments.splice(index, 1);
        this.deleteSegmentModalVisible = false;
      }
    }, error => {
      console.log(error);
    });
  }

  resetAddNewSegmentModalData(): void {
    this.newSegmentName = undefined;
    this.newSegmentDescription = undefined;
    this.segmentNameAlreadyExistsError = false;
    this.addNewSegmentModalVisible = false;
    this.showSegmentEmoji = false;
    this.showEditEmoji = false;
    this.showTableEmoji = false;
  }

  resetAddNewTableModalData(): void {
    this.newTableName = undefined;
    this.showSegmentEmoji = false;
    this.showEditEmoji = false;
    this.showTableEmoji = false;
    this.tableNameAlreadyExistsError = false;
    this.addNewTableModalVisible = false;
  }

  resetEditSegmentModalData(): void {
    this.editSegmentModalVisible = false;
    this.segmentToBeEdited = undefined;
    this.editSegmentNameAlreadyExistsError = false;
    this.isEditSegmentEmojiChanged = false;
  }

  trackByFn(index): void {
    return index;
  }

  showProspectTable(selectedTable: TableModel): void {
    console.log(selectedTable);
    this.prospectService.selectedTable = selectedTable;
    const urlTree: string = '/prospect/' + selectedTable.segmentId + '/' + selectedTable.tableId;
    this.router.navigateByUrl(urlTree);
  }

  onEditSegmentDetails(segment: Segment): void {
    this.segmentToBeEdited = Object.assign({}, segment);
    this.editSegmentModalVisible = true;
  }

  onSaveEditSegment(): void {
    this.isEditSegmentLoading = true;
    const segmentRequest = new SegmentRequest();
    segmentRequest.segmentId = this.segmentToBeEdited.segmentId;
    segmentRequest.segmentName = this.segmentToBeEdited.segmentName;
    segmentRequest.emoji = this.segmentToBeEdited.emoji;
    segmentRequest.description = this.segmentToBeEdited.description;
    this.prospectService.editIndividualSegment(segmentRequest).subscribe(response => {
      const responseSegment: Segment = response.object;
      const index = this.segments.findIndex(segment => segment.segmentId === responseSegment.segmentId);
      this.segments[index] = responseSegment;
      this.isEditSegmentLoading = false;
      this.resetEditSegmentModalData();
    }, error => {
      console.log(error);
      this.isEditSegmentLoading = false;
    });
  }

  onChangeNewSegmentName(newSegmentName: string): void {
    if (newSegmentName) {
      this.segmentNameAlreadyExistsError = false;
      this.prospectService.checkDuplicateSegmentName(newSegmentName).subscribe(response => {
      }, error => {
        if (error.errorCode == 409) {
          this.segmentNameAlreadyExistsError = true;
        }
      });
    }
  }

  onChangeEditSegmentName(segmentId: number, segmentName: string): void {
    if (segmentName) {
      this.editSegmentNameAlreadyExistsError = false;
      this.prospectService.checkDuplicateEditSegmentName(segmentId, segmentName).subscribe(response => {
      }, error => {
        if (error.errorCode == 409) {
          this.editSegmentNameAlreadyExistsError = true;
        }
      });
    }
  }

  onChangeNewTableName(newTableName: string): void {
    if (newTableName) {
      this.tableNameAlreadyExistsError = false;
      this.prospectService.checkDuplicateTableName(newTableName, this.newTableSegmentId).subscribe(response => {
      }, error => {
        if (error.errorCode == 409) {
          this.tableNameAlreadyExistsError = true;
        }
      });
    }
  }

  onTableCustomColor(fillColor: string): void {
    this.selectedTableColor = fillColor;
    this.showColorDDM = false;
  }

  scrollSegmentIntoView(i: number): void {
    document.getElementById('selectedSegmentData' + i).scrollIntoView({behavior: 'smooth'});
  }


  getSegmentView() {
    this.prospectService.getSegmentView().subscribe(response => {
      response.object.viewId == 1 ? this.listView = true : this.listView = false;
    }, error => {
      console.log(error);
    });
  }

  updateSegmentView(viewId: number) {
    viewId == 1 ? this.listView = true : this.listView = false;
    const segmentView: SegmentView = new SegmentView();
    segmentView.viewId = viewId;
    console.log(segmentView);
    this.prospectService.updateSegmentView(segmentView).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }
}

