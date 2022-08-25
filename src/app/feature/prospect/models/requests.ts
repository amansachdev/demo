export class GroupByReq {
  colType: string;
  colId: number;
  colValue: string;
  columnName: string;
  className: string;
}

export class SortByReq {
  colId: number;
  colType: string;
  userId: number;
  companyId: number;
  ascOrDesc: string;
}

export class SortByRequest {
  sortByReq: SortByReq;
  commonFilterRequest: CommonFilterRequest;
}

export class CommonFilterRequest {
  filterClass: string;
  type: string;
  filterRequstList: Filter[] = [];
}

export class Filter {
  clauseType: string;
  columnName: string;
  columnValue: string;
  startDate: any;
  endDate: any;
}

export class GroupByRequest {
  groupByReq: GroupByReq;
  sortByReq: SortByReq;
  commonFilterRequest: CommonFilterRequest;
}

export class FilterProperty {
  clauseType: any;
  columnName: any;
  columnValue: any;
  startDate: any;
  endDate: any;
  columnType: any;
  customFieldId: any;
}
