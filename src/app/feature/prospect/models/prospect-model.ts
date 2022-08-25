export class Segment {
  id: number;
  segmentId: number;
  segmentName: string;
  createdDate: Date;
  updatedDate: Date;
  userId: number = 12345;
  companyId: number = 45678;
  deleted: boolean;
  description: string;
  emoji: string;
  tableModelList: TableModel[];
  hidden: boolean = false;
}

export class TableModel {
  id: number;
  name: string = '';
  emoji: string = '';
  color: string;
  segmentId: number;
  userId: number = 12345;
  companyId: number = 45678;
  tableId: number;
  deleted: boolean;
}


export class SegmentRequest {
  segmentId: number;
  segmentName: string;
  description: string;
  emoji: string;
}

export class AddTableRequest {
  segmentId: number;
  name: string;
  emoji: string;
  color: string;
}

export class ProspectColumn {
  id: number;
  title: string;
  width: string;
  type: string;
  icon: string;
  field: string;
  flag: number;
  frameId: number;
  colId: number;
  columnType: number;
  isDeleted: number;
  cardViewStatus: boolean;
  sequence: number;
  hidden: boolean;
}

export class ResponseList {
  responseCodeJson: ResponseJsonCode;
  list: any[];
}

class ResponseJsonCode {
  message: string;
  code: number;
  reqId: number;
}

export class AllTagsOptions {
  position: string[];
  companySize: string[];
  companySizeOnLinkedIn: string[];
  industry: string[];
  city: string[];
  country: string[];
  approvalStatus: string[];
  searchStatus: string[];
}

export class TagOptions {
  id: number;
  userId: number = 12345;
  companyId: number = 45678;
  tagName: string;
  tagOptions: string[];
  deleted: number;
}

export class GroupedByData {
  propertyFieldValue: any;
  filteredData: any[];
  palindrome: boolean[][];
  collapse: boolean;
  randomColor: any;
  randomRGB: any;
}


export class SegmentView {
  id: number;
  userId: number = 12345;
  companyId: number = 45678;
  viewId: number;
}
