import { Component, OnInit } from '@angular/core';
import {TableMenuService} from '../../../feature/prospect/table-menus/table-menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public tableMenuService: TableMenuService) { }

  ngOnInit(): void {
  }

}
