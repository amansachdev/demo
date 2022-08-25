import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'columnFilter'
})
export class ColumnFilterPipe implements PipeTransform {
  transform(items: any[], title: string): any {
    if (!items || !title) {
      return items;
    }
    return items.filter(item => item.title.toLowerCase().indexOf(title.toLowerCase()) !== -1);
  }
}
