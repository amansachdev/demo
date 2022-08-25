import { Component, OnInit } from '@angular/core';
import {ProspectService} from '../../feature/prospect/prospect.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  profile = 'assets/table/user.svg';

  constructor(public prospectService: ProspectService) { }

  ngOnInit(): void {
  }

}
