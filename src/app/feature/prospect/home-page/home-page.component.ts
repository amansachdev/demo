import {Component, OnInit} from '@angular/core';
import {TableMenuService} from '../table-menus/table-menu.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  isLoading = false;
  isActive = true;
  constructor(public tableMenuService: TableMenuService) {
  }

  ngOnInit(): void {
    this.tableMenuService.homePageLoaded = true;
  }

}
