import { Component } from '@angular/core';
import {TableMenuService} from './feature/prospect/table-menus/table-menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'alore-prospector';
  constructor(public tableMenuService: TableMenuService) {
  }
}
