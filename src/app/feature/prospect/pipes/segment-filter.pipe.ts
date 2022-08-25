import { Pipe, PipeTransform } from '@angular/core';
import {Segment} from '../models/prospect-model';

@Pipe({
  name: 'segmentFilter'
})
export class SegmentFilterPipe implements PipeTransform {

  transform(segments: Segment[], segmentName:string): Segment[] {
    if(!segments || !segmentName) {
      return  segments;
    }
    return segments.filter(segment => segment.segmentName.toLowerCase().indexOf(segmentName.toLowerCase()) !== -1);
  }
}
